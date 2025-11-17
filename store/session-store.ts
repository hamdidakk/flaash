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
  login: (payload: { username: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  loadProfile: () => Promise<void>
  setUser: (user: SessionUser | null) => void
  updateUser: (updates: Partial<SessionUser>) => void
}

export const useSessionStore = create<SessionState>((set, get) => ({
  user: null,
  status: "idle",
  error: undefined,
  errorCode: undefined,
  async login(payload) {
    set({ status: "loading", error: undefined, errorCode: undefined })
    try {
      const { data } = await sessionLogin(payload)
      set({ user: data ?? null, status: data ? "authenticated" : "unauthenticated", error: undefined, errorCode: undefined })
    } catch (error) {
      const appError = error instanceof AppError ? error : new AppError(401, "Impossible de se connecter.", error)
      set({
        error: appError.message,
        errorCode: appError.code,
        status: "unauthenticated",
      })
      throw appError
    }
  },
  async logout() {
    try {
      await sessionLogout()
    } finally {
      set({ user: null, status: "unauthenticated", error: undefined, errorCode: undefined })
    }
  },
  async loadProfile() {
    set({ status: "loading", error: undefined, errorCode: undefined })
    try {
      const profile = await sessionProfile()
      if (profile) {
        set({ user: profile, status: "authenticated", error: undefined, errorCode: undefined })
      } else {
        set({ user: null, status: "unauthenticated", error: undefined, errorCode: 401 })
      }
    } catch (error) {
      const appError = error instanceof AppError ? error : new AppError(500, "Erreur lors du chargement de la session.", error)
      set({
        user: null,
        status: "unauthenticated",
        error: appError.message,
        errorCode: appError.code,
      })
    }
  },
  setUser(user) {
    set({ user, status: user ? "authenticated" : "unauthenticated", error: undefined, errorCode: undefined })
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
      }
    })
  },
}))

