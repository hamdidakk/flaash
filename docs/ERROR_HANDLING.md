# Gestion des Erreurs / Error Handling

Ce document explique comment utiliser le système de gestion des erreurs centralisé de l'application.

## Vue d'ensemble

L'application dispose d'un système complet de gestion des erreurs avec:
- Pages d'erreur dédiées pour chaque code HTTP (400, 401, 403, 404, 500, 503)
- Traductions en français et anglais
- Gestion automatique des erreurs via les error boundaries de Next.js
- Utilitaires pour déclencher des erreurs manuellement

## Codes d'erreur supportés

| Code | Type | Description FR | Description EN |
|------|------|----------------|----------------|
| 400 | Bad Request | Requête invalide | Invalid request |
| 401 | Unauthorized | Non autorisé | Unauthorized |
| 403 | Forbidden | Accès interdit | Forbidden |
| 404 | Not Found | Page non trouvée | Page not found |
| 500 | Internal Server Error | Erreur serveur | Server error |
| 503 | Service Unavailable | Service indisponible | Service unavailable |

## Utilisation

### 1. Gestion automatique des erreurs

Les erreurs non gérées sont automatiquement capturées par les error boundaries:

\`\`\`tsx
// Les erreurs dans les composants sont automatiquement gérées
function MyComponent() {
  throw new Error("Something went wrong") // Affichera la page d'erreur 500
}
\`\`\`

### 2. Redirection vers une page d'erreur

Utilisez le hook `useErrorHandler` pour rediriger vers une page d'erreur:

\`\`\`tsx
import { useErrorHandler } from "@/lib/use-error-handler"

function MyComponent() {
  const { showError, showErrorCode } = useErrorHandler()

  const handleAction = async () => {
    try {
      // Votre code
    } catch (error) {
      showError(error) // Analyse l'erreur et redirige vers la page appropriée
    }
  }

  const handleUnauthorized = () => {
    showErrorCode(401) // Redirige directement vers /error/401
  }
}
\`\`\`

### 3. Lancer une erreur typée

Utilisez la classe `AppError` pour créer des erreurs avec des codes spécifiques:

\`\`\`tsx
import { AppError } from "@/lib/error-handler"

async function fetchData() {
  const response = await fetch("/api/data")
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new AppError(401, "Authentication required")
    }
    if (response.status === 403) {
      throw new AppError(403, "Insufficient permissions")
    }
    throw new AppError(500, "Failed to fetch data")
  }
  
  return response.json()
}
\`\`\`

### 4. Protection de routes

Utilisez le composant `ProtectedRoute` pour protéger les pages nécessitant une authentification:

\`\`\`tsx
import { ProtectedRoute } from "@/components/protected-route"

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      {/* Contenu de la page admin */}
    </ProtectedRoute>
  )
}
\`\`\`

Si l'utilisateur n'est pas connecté → redirige vers `/error/401`
Si l'utilisateur n'a pas les permissions → redirige vers `/error/403`

## Structure des fichiers

\`\`\`
app/
├── error.tsx                    # Error boundary pour l'app
├── global-error.tsx             # Error boundary global
├── not-found.tsx                # Page 404
├── error/
│   └── [code]/
│       └── page.tsx             # Pages d'erreur dynamiques
├── (dashboard)/
│   └── error.tsx                # Error boundary pour le dashboard
components/
├── error-page.tsx               # Composant réutilisable pour les pages d'erreur
└── protected-route.tsx          # Composant de protection de routes
lib/
├── error-handler.ts             # Utilitaires de gestion d'erreurs
└── use-error-handler.ts         # Hook pour gérer les erreurs
\`\`\`

## Personnalisation

### Ajouter un nouveau code d'erreur

1. Ajoutez les traductions dans `lib/i18n.ts`:

\`\`\`typescript
errors: {
  429: {
    title: "Too Many Requests",
    description: "You've made too many requests. Please try again later.",
    action: "Try Again",
  }
}
\`\`\`

2. Ajoutez le code dans `lib/error-handler.ts`:

\`\`\`typescript
export type ErrorCode = 400 | 401 | 403 | 404 | 429 | 500 | 503
\`\`\`

3. Le système gérera automatiquement la nouvelle erreur!

## Exemples d'utilisation

### Exemple 1: API Route avec gestion d'erreurs

\`\`\`typescript
import { AppError } from "@/lib/error-handler"

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      throw new AppError(401, "Authentication required")
    }
    
    if (!user.hasPermission("read:data")) {
      throw new AppError(403, "Insufficient permissions")
    }
    
    const data = await fetchData()
    return Response.json(data)
    
  } catch (error) {
    if (error instanceof AppError) {
      return Response.json(
        { error: error.message },
        { status: error.code }
      )
    }
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
\`\`\`

### Exemple 2: Composant avec gestion d'erreurs

\`\`\`tsx
"use client"

import { useErrorHandler } from "@/lib/use-error-handler"
import { AppError } from "@/lib/error-handler"

export function DataFetcher() {
  const { showError } = useErrorHandler()
  
  const loadData = async () => {
    try {
      const response = await fetch("/api/data")
      
      if (response.status === 401) {
        throw new AppError(401, "Please log in to continue")
      }
      
      if (!response.ok) {
        throw new AppError(500, "Failed to load data")
      }
      
      const data = await response.json()
      // Traiter les données
      
    } catch (error) {
      showError(error) // Redirige vers la page d'erreur appropriée
    }
  }
  
  return <button onClick={loadData}>Load Data</button>
}
