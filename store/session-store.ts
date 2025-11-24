"use client"

import { create } from "zustand"
import { sessionLogin, sessionLogout, sessionProfile } from "@/lib/session-client"
import { AppError, type ErrorCode } from "@/lib/error-handler"
import type { User } from "@/lib/user-roles"

type SessionUser = User

type SessionState = {
  user: SessionUser | null
  status: "idle" | "loading" | "authenticated" | "unauthenticated"
  error?: string
  errorCode?: ErrorCode
  throttled: boolean
  login: (payload: { username: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  loadProfile: () => Promise<void>
  setUser: (user: SessionUser | null) => void
  updateUser: (updates: Partial<SessionUser>) => void
  clearError: () => void
}

export const useSessionStore = create<SessionState>((set, get) => ({
  user: null,
  status: "idle",
  error: undefined,
  errorCode: undefined,
  throttled: false,
  async login(payload) {
    set({ status: "loading", error: undefined, errorCode: undefined, throttled: false })
    try {
      const { data } = await sessionLogin(payload)
      set({
        user: data ?? null,
        status: data ? "authenticated" : "unauthenticated",
        error: undefined,
        errorCode: undefined,
        throttled: false,
      })
    } catch (error) {
      const appError = error instanceof AppError ? error : new AppError(401, "Impossible de se connecter.", error)
      set({
        error: appError.message,
        errorCode: appError.code,
        status: "unauthenticated",
        throttled: appError.throttled ?? false,
      })
      throw appError
    }
  },
  async logout() {
    try {
      await sessionLogout()
    } catch (error) {
      // Ignorer les erreurs 401 lors du logout (c'est normal si la session est déjà expirée)
      if (!(error instanceof AppError && error.code === 401)) {
        console.warn("Erreur lors de la déconnexion:", error)
      }
    } finally {
      set({ user: null, status: "unauthenticated", error: undefined, errorCode: undefined, throttled: false })
    }
  },
  async loadProfile() {
    set({ status: "loading", error: undefined, errorCode: undefined, throttled: false })
    try {
      const profile = await sessionProfile()
      if (profile) {
        set({ user: profile, status: "authenticated", error: undefined, errorCode: undefined, throttled: false })
      } else {
        // Pas de profil = utilisateur non authentifié (normal après déconnexion)
        set({ user: null, status: "unauthenticated", error: undefined, errorCode: 401, throttled: false })
      }
    } catch (error) {
      // Si c'est une erreur 401, c'est normal (utilisateur non authentifié)
      // On ne la traite pas comme une erreur critique
      if (error instanceof AppError && error.code === 401) {
        set({ user: null, status: "unauthenticated", error: undefined, errorCode: 401, throttled: false })
        return
      }
      // Pour les autres erreurs, on les traite comme des erreurs serveur
      const appError = error instanceof AppError ? error : new AppError(500, "Erreur lors du chargement de la session.", error)
      set({
        user: null,
        status: "unauthenticated",
        error: appError.message,
        errorCode: appError.code,
        throttled: appError.throttled ?? false,
      })
    }
  },
  setUser(user) {
    set({ user, status: user ? "authenticated" : "unauthenticated", error: undefined, errorCode: undefined, throttled: false })
  },
  updateUser(updates) {
    set((state) => {
      if (!state.user) {
        return state
      }
      return {
        user: { ...state.user, ...updates },
        status: "authenticated",
        error: undefined,
        errorCode: undefined,
        throttled: false,
      }
    })
  },
  clearError() {
    set({ error: undefined, errorCode: undefined, throttled: false })
  },
}))

