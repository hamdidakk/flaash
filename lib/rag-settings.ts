import type { RagPromptType } from "@/lib/types"

export interface RagSettings {
  model: string
  temperature: number
  systemPrompt: string
  promptType: RagPromptType
  collectionId: string
}

export const DEFAULT_RAG_SETTINGS: RagSettings = {
  model: "gpt-4o",
  temperature: 0.7,
  systemPrompt: "You are a helpful assistant that answers questions based on the provided documents. Always cite your sources.",
  promptType: "short",
  collectionId: "all",
}

const SETTINGS_STORAGE_KEY = "rag-default-settings"

/**
 * Charge les paramètres RAG par défaut depuis localStorage
 * Retourne les paramètres par défaut si aucun n'est sauvegardé
 */
export function loadDefaultRagSettings(): RagSettings {
  if (typeof window === "undefined") {
    return DEFAULT_RAG_SETTINGS
  }

  try {
    const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Valider et fusionner avec les valeurs par défaut pour s'assurer que tous les champs sont présents
      return {
        ...DEFAULT_RAG_SETTINGS,
        ...parsed,
      }
    }
  } catch (error) {
    console.error("[RAG Settings] Failed to load default settings:", error)
  }

  return DEFAULT_RAG_SETTINGS
}

/**
 * Sauvegarde les paramètres RAG par défaut dans localStorage
 */
export function saveDefaultRagSettings(settings: RagSettings): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error("[RAG Settings] Failed to save default settings:", error)
    throw error
  }
}

/**
 * Réinitialise les paramètres RAG par défaut
 */
export function resetDefaultRagSettings(): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.removeItem(SETTINGS_STORAGE_KEY)
  } catch (error) {
    console.error("[RAG Settings] Failed to reset default settings:", error)
  }
}

