/**
 * Types et helpers pour la gestion des rôles utilisateur
 */

export type UserRole = "admin" | "manager" | "agent" | "member"

export interface User {
  id: number
  email: string
  is_staff: boolean
  role: UserRole
  name?: string
  [key: string]: unknown
}

/**
 * Détermine si un utilisateur a accès au dashboard
 * Les admins, managers et staff ont accès au dashboard
 */
export function isDashboardUser(user: User | null): boolean {
  if (!user) return false
  return user.is_staff || user.role === "admin" || user.role === "manager"
}

/**
 * Détermine si un utilisateur a accès au chatbot
 * Tous les rôles ont accès au chatbot
 */
export function isChatUser(user: User | null): boolean {
  if (!user) return false
  return ["admin", "manager", "agent", "member"].includes(user.role)
}

