"use client"

import { create } from "zustand"

import { AppError } from "@/lib/error-handler"
import {
  clearStoredPartnerConfig,
  clearStoredPartnerToken,
  ensurePartnerToken,
  getStoredPartnerConfig,
  getStoredPartnerToken,
  PartnerAuthConfig,
  requestPartnerToken,
  setStoredPartnerConfig,
  setStoredPartnerToken,
  StoredPartnerToken,
} from "@/lib/partner-auth"

type PartnerAuthStatus = "idle" | "loading" | "authenticated" | "error"

type PartnerAuthState = {
  config: PartnerAuthConfig | null
  token: StoredPartnerToken | null
  status: PartnerAuthStatus
  error?: string
  throttled?: boolean
  hydrate: () => void
  saveConfig: (config: PartnerAuthConfig) => void
  authenticate: (config?: PartnerAuthConfig) => Promise<StoredPartnerToken>
  refresh: () => Promise<StoredPartnerToken>
  clear: () => void
}

const defaultState = (): Pick<PartnerAuthState, "config" | "token" | "status" | "error"> => ({
  config: null,
  token: null,
  status: "idle",
  error: undefined,
})

export const usePartnerAuthStore = create<PartnerAuthState>((set, get) => ({
  ...defaultState(),
  throttled: false,

  hydrate() {
    const storedConfig = getStoredPartnerConfig()
    const storedToken = getStoredPartnerToken()
    set({
      config: storedConfig,
      token: storedToken,
      status: storedToken ? "authenticated" : "idle",
      error: undefined,
      throttled: false,
    })
  },

  saveConfig(config) {
    setStoredPartnerConfig(config)
    set({ config, error: undefined })
  },

  async authenticate(config) {
    const effectiveConfig = config ?? get().config
    if (!effectiveConfig) {
      const err = new AppError(400, "Partner configuration is missing")
      set({ error: err.message })
      throw err
    }
    set({ status: "loading", error: undefined })
    try {
      const token = await requestPartnerToken(effectiveConfig)
      set({ token, status: "authenticated", throttled: false })
      return token
    } catch (error) {
      const appError = error instanceof AppError ? error : new AppError(500, "Failed to obtain partner token", error)
      set({ error: appError.message, status: "error", throttled: appError.throttled ?? false })
      throw appError
    }
  },

  async refresh() {
    set({ status: "loading", error: undefined })
    try {
      const token = await ensurePartnerToken(get().config ?? undefined)
      set({ token, status: "authenticated", throttled: false })
      return token
    } catch (error) {
      const appError = error instanceof AppError ? error : new AppError(401, "Partner session expired", error)
      set({ error: appError.message, status: "error", throttled: appError.throttled ?? false })
      throw appError
    }
  },

  clear() {
    clearStoredPartnerConfig()
    clearStoredPartnerToken()
    setStoredPartnerToken(null)
    set({ ...defaultState(), throttled: false })
  },
}))


