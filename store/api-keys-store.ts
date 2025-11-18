"use client"

import { create } from "zustand"

import {
  createApiKey,
  listApiKeyEvents,
  listApiKeys,
  revokeApiKey,
  rotateApiKey,
  type ApiKeyEvent,
  type ApiKeyEventFilters,
  type ApiKeyListFilters,
  type ApiKeyRecord,
  type ApiKeySecret,
  type CreateApiKeyPayload,
  type RevokeApiKeyPayload,
  type RotateApiKeyPayload,
} from "@/lib/api-keys"
import { AppError } from "@/lib/error-handler"

type ApiKeysState = {
  keys: ApiKeyRecord[]
  totalKeys: number
  events: ApiKeyEvent[]
  totalEvents: number
  isLoadingKeys: boolean
  isLoadingEvents: boolean
  filters: ApiKeyListFilters
  eventFilters: ApiKeyEventFilters
  error?: string
  throttled: boolean
  lastCreatedSecret?: ApiKeySecret | null
  fetchKeys: (filters?: ApiKeyListFilters) => Promise<void>
  fetchEvents: (filters?: ApiKeyEventFilters) => Promise<void>
  createKey: (payload: CreateApiKeyPayload) => Promise<ApiKeySecret | null>
  rotateKey: (id: string | number, payload?: RotateApiKeyPayload) => Promise<ApiKeySecret | null>
  revokeKey: (id: string | number, payload?: RevokeApiKeyPayload) => Promise<ApiKeyRecord | null>
  setFilters: (filters: ApiKeyListFilters) => void
  setEventFilters: (filters: ApiKeyEventFilters) => void
  clearError: () => void
  clearLastSecret: () => void
}

const DEFAULT_LIST_FILTERS: ApiKeyListFilters = {
  limit: 20,
  offset: 0,
}

const DEFAULT_EVENT_FILTERS: ApiKeyEventFilters = {
  limit: 20,
  offset: 0,
}

// Helper pour nettoyer les messages d'erreur HTML (ex: pages Django 404)
const cleanErrorMessage = (message: string, code?: number): string => {
  if (message.includes("<!DOCTYPE") || message.includes("<html")) {
    // Extraire le titre de la page d'erreur si possible
    const titleMatch = message.match(/<title>([^<]+)<\/title>/i)
    if (titleMatch) {
      return titleMatch[1]
    } else if (code === 404) {
      return "Endpoint non disponible (404). Cette fonctionnalité sera disponible prochainement."
    } else {
      return "Erreur lors du chargement des données."
    }
  }
  return message
}

export const useApiKeysStore = create<ApiKeysState>((set, get) => ({
  keys: [],
  totalKeys: 0,
  events: [],
  totalEvents: 0,
  isLoadingKeys: false,
  isLoadingEvents: false,
  filters: DEFAULT_LIST_FILTERS,
  eventFilters: DEFAULT_EVENT_FILTERS,
  error: undefined,
  throttled: false,
  lastCreatedSecret: null,

  clearError() {
    set({ error: undefined, throttled: false })
  },

  clearLastSecret() {
    set({ lastCreatedSecret: null })
  },

  setFilters(filters) {
    set({ filters: { ...get().filters, ...filters } })
  },

  setEventFilters(filters) {
    set({ eventFilters: { ...get().eventFilters, ...filters } })
  },

  async fetchKeys(filters) {
    set({ isLoadingKeys: true, error: undefined, throttled: false })
    const nextFilters = filters ?? get().filters ?? DEFAULT_LIST_FILTERS
    try {
      const response = await listApiKeys(nextFilters)
      set({
        keys: response.results,
        totalKeys: response.count,
        filters: nextFilters,
        throttled: false,
      })
    } catch (error) {
      const appError = error instanceof AppError ? error : new AppError(500, "Impossible de charger les clés API.", error)
      const cleanMessage = cleanErrorMessage(appError.message, appError.code)
      set({ error: cleanMessage, throttled: appError.throttled ?? false })
      throw appError
    } finally {
      set({ isLoadingKeys: false })
    }
  },

  async fetchEvents(filters) {
    set({ isLoadingEvents: true, error: undefined, throttled: false })
    const nextFilters = filters ?? get().eventFilters ?? DEFAULT_EVENT_FILTERS
    try {
      const response = await listApiKeyEvents(nextFilters)
      set({
        events: response.results,
        totalEvents: response.count,
        eventFilters: nextFilters,
        throttled: false,
      })
    } catch (error) {
      const appError = error instanceof AppError ? error : new AppError(500, "Impossible de charger les logs API.", error)
      const cleanMessage = cleanErrorMessage(appError.message, appError.code)
      set({ error: cleanMessage, throttled: appError.throttled ?? false })
      throw appError
    } finally {
      set({ isLoadingEvents: false })
    }
  },

  async createKey(payload) {
    set({ error: undefined, throttled: false })
    try {
      const secret = await createApiKey(payload)
      await get().fetchKeys()
      set({ lastCreatedSecret: secret, throttled: false })
      return secret
    } catch (error) {
      // Si c'est déjà une AppError (ex: 404 avec message spécifique), la préserver
      const appError = error instanceof AppError 
        ? error 
        : new AppError(500, "Impossible de créer la clé API.", error)
      const cleanMessage = cleanErrorMessage(appError.message, appError.code)
      set({ error: cleanMessage, throttled: appError.throttled ?? false })
      throw appError
    }
  },

  async rotateKey(id, payload) {
    set({ error: undefined, throttled: false })
    try {
      const secret = await rotateApiKey(id, payload)
      await Promise.all([get().fetchKeys(), get().fetchEvents()])
      set({ lastCreatedSecret: secret, throttled: false })
      return secret
    } catch (error) {
      // Si c'est déjà une AppError (ex: 404 avec message spécifique), la préserver
      const appError = error instanceof AppError 
        ? error 
        : new AppError(500, "Impossible de régénérer la clé API.", error)
      const cleanMessage = cleanErrorMessage(appError.message, appError.code)
      set({ error: cleanMessage, throttled: appError.throttled ?? false })
      throw appError
    }
  },

  async revokeKey(id, payload) {
    set({ error: undefined, throttled: false })
    try {
      const record = await revokeApiKey(id, payload)
      await Promise.all([get().fetchKeys(), get().fetchEvents()])
      return record
    } catch (error) {
      // Si c'est déjà une AppError (ex: 404 avec message spécifique), la préserver
      const appError = error instanceof AppError 
        ? error 
        : new AppError(500, "Impossible de révoquer la clé API.", error)
      const cleanMessage = cleanErrorMessage(appError.message, appError.code)
      set({ error: cleanMessage, throttled: appError.throttled ?? false })
      throw appError
    }
  },
}))

