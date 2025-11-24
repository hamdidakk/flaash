"use client"

import { useCallback } from "react"
import { AppError } from "@/lib/error-handler"
import { toast } from "@/hooks/use-toast"
import { useLanguage } from "@/lib/language-context"

/**
 * Hook pour gérer les erreurs et les afficher via des toasts
 * Au lieu d'afficher les erreurs dans la console, on les affiche dans l'UI
 */
export function useErrorHandler() {
  const { t } = useLanguage()

  const handleError = useCallback(
    (error: unknown, options?: { title?: string; showToast?: boolean }) => {
      const showToast = options?.showToast !== false // Par défaut, afficher le toast
      const customTitle = options?.title

      let appError: AppError
      let errorMessage: string
      let errorTitle: string

      if (error instanceof AppError) {
        appError = error
        // Traduire les messages d'erreur spécifiques
        if (appError.code === 401) {
          if (appError.message.includes("credentials were not provided")) {
            errorMessage = t("auth.credentialsNotProvided")
          } else if (appError.message.includes("Authentication required") || appError.message.includes("authentication")) {
            errorMessage = t("auth.authenticationRequired")
          } else {
            errorMessage = appError.message
          }
        } else if (appError.message.includes("Collection not found") || appError.message.includes("collection not found")) {
          errorMessage = t("documents.errors.collectionNotFound")
        } else {
          errorMessage = appError.message
        }
        errorTitle = customTitle || getErrorTitle(appError.code)
      } else if (error instanceof Error) {
        // Traduire les messages d'erreur spécifiques
        let translatedMessage = error.message
        if (error.message.includes("credentials were not provided")) {
          translatedMessage = t("auth.credentialsNotProvided")
        } else if (error.message.includes("Authentication required") || error.message.includes("authentication")) {
          translatedMessage = t("auth.authenticationRequired")
        } else if (error.message.includes("Collection not found") || error.message.includes("collection not found")) {
          translatedMessage = t("documents.errors.collectionNotFound")
        }
        appError = new AppError(500, translatedMessage, error)
        errorMessage = translatedMessage
        errorTitle = customTitle || t("common.error") || "Erreur"
      } else {
        appError = new AppError(500, String(error), error)
        errorMessage = String(error)
        errorTitle = customTitle || t("common.error") || "Erreur"
      }

      // Nettoyer le message d'erreur (enlever le HTML si présent)
      const cleanMessage = cleanErrorMessage(errorMessage)

      // Afficher le toast si demandé
      if (showToast) {
        toast({
          title: errorTitle,
          description: cleanMessage,
          variant: appError.code >= 500 ? "destructive" : "default",
          duration: appError.throttled ? 10000 : 5000, // Plus long pour les erreurs de throttling
        })
      }

      // Logger l'erreur en développement (mais pas en production pour éviter le spam)
      // Utiliser console.warn pour les erreurs déjà gérées (affichées via toast)
      // Utiliser console.error uniquement pour les erreurs serveur (500+)
      // Ne pas logger les erreurs 401 (authentification) car elles sont normales après déconnexion
      if (process.env.NODE_ENV === "development" && appError.code !== 401) {
        const logData: Record<string, unknown> = {
          code: appError.code,
          message: cleanMessage,
        }
        
        // Ajouter les détails seulement s'ils existent et sont utiles
        if (appError.details) {
          // Si details est un objet avec des clés, l'ajouter
          if (typeof appError.details === "object" && appError.details !== null) {
            if (Array.isArray(appError.details) || Object.keys(appError.details).length > 0) {
              logData.details = appError.details
            }
          } else if (typeof appError.details === "string" && appError.details.length > 0) {
            logData.details = appError.details
          }
          
          // Si details contient une erreur Error, extraire le stack trace
          if (appError.details instanceof Error) {
            if (appError.details.message !== cleanMessage) {
              logData.originalError = appError.details.message
            }
            if (appError.details.stack) {
              logData.stack = appError.details.stack
            }
          }
        }
        
        // Ne logger que si on a au moins un message ou un code
        if (cleanMessage || appError.code) {
          // Formater le log de manière plus lisible
          const logMessage = `[ErrorHandler] ${appError.code >= 500 ? "Server Error" : "Client Error"} (${appError.code}): ${cleanMessage}`
          
          // Ajouter une note pour les erreurs 404 sur l'URL si disponible
          let enhancedLogData = { ...logData }
          if (appError.code === 404 && appError.details && typeof appError.details === "object" && appError.details !== null) {
            const details = appError.details as Record<string, unknown>
            if (details.url) {
              enhancedLogData.url = details.url
              enhancedLogData.note = "Pour voir l'URL exacte envoyée au backend, vérifier les logs du serveur Next.js (terminal) qui affichent [dakkom-proxy] Request"
            }
          }
          
          // Utiliser console.warn pour les erreurs client (400-499), console.error pour les erreurs serveur (500+)
          if (appError.code >= 500) {
            console.error(logMessage, enhancedLogData)
          } else {
            // Pour les erreurs 404, utiliser console.info au lieu de console.warn pour réduire le bruit
            if (appError.code === 404) {
              console.info(logMessage, enhancedLogData)
            } else {
              console.warn(logMessage, enhancedLogData)
            }
          }
        }
      }

      return appError
    },
    [t],
  )

  return { handleError }
}

/**
 * Obtient un titre d'erreur basé sur le code HTTP
 * Note: Cette fonction est utilisée dans useErrorHandler qui a déjà accès à `t`
 * mais on la garde simple ici pour éviter les dépendances circulaires
 */
function getErrorTitle(code: number): string {
  switch (code) {
    case 400:
      return "Requête invalide"
    case 401:
      return "Authentification requise"
    case 403:
      return "Accès refusé"
    case 404:
      return "Ressource non trouvée"
    case 429:
      return "Trop de requêtes"
    case 500:
      return "Erreur serveur"
    case 503:
      return "Service indisponible"
    default:
      return "Erreur"
  }
}

/**
 * Nettoie le message d'erreur (enlève le HTML, les objets JSON bruts, etc.)
 */
function cleanErrorMessage(message: string): string {
  // Enlever le HTML
  if (message.includes("<!DOCTYPE") || message.includes("<html")) {
    const titleMatch = message.match(/<title>([^<]+)<\/title>/i)
    if (titleMatch) {
      return titleMatch[1]
    }
    return "Erreur serveur (page HTML reçue)"
  }

  // Essayer de parser comme JSON si c'est un objet JSON brut
  try {
    const parsed = JSON.parse(message)
    if (typeof parsed === "object") {
      return parsed.detail || parsed.error || parsed.message || JSON.stringify(parsed)
    }
  } catch {
    // Ce n'est pas du JSON, continuer
  }

  // Limiter la longueur du message
  if (message.length > 200) {
    return message.substring(0, 200) + "..."
  }

  return message
}

