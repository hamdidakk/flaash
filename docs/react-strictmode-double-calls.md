# Pourquoi les appels API apparaissent en double ?

## 🔍 Le problème

Lors d'un simple refresh de la page, tu peux voir que les appels API sont exécutés **deux fois** :

```
GET http://localhost:3000/api/dakkom/api/v1/document/list 404 (Not Found)
[ErrorHandler] Client Error (404): Collection non trouvée...
GET http://localhost:3000/api/dakkom/api/v1/document/list 404 (Not Found)
[ErrorHandler] Client Error (404): Collection non trouvée...
```

## 🎯 La cause

### React StrictMode en développement

**Next.js active automatiquement React StrictMode en développement** (depuis la version 13). StrictMode exécute intentionnellement les effets (`useEffect`) **deux fois** pour détecter les problèmes de side effects.

C'est un comportement **normal et attendu** en développement. En production, les effets ne s'exécutent qu'une seule fois.

### Pourquoi StrictMode fait ça ?

StrictMode aide à détecter :
- Les effets qui ne sont pas idempotents (qui produisent des résultats différents à chaque exécution)
- Les fuites de mémoire
- Les problèmes de nettoyage des effets

## ✅ La solution

Pour éviter les appels doubles, nous avons ajouté une protection avec `useRef` :

```typescript
const isLoadingRef = useRef(false)

const reloadDocuments = async () => {
  // Éviter les appels doubles (React StrictMode en développement)
  if (isLoadingRef.current) {
    return
  }
  
  try {
    isLoadingRef.current = true
    setIsLoading(true)
    // ... appel API
  } finally {
    isLoadingRef.current = false
    setIsLoading(false)
  }
}
```

Cette protection garantit qu'un seul appel est en cours à la fois, même si `useEffect` est exécuté deux fois.

## 📝 Notes importantes

1. **En développement uniquement** : Ce comportement double n'existe qu'en développement. En production, les effets s'exécutent une seule fois.

2. **C'est une bonne pratique** : Si ton code fonctionne correctement avec StrictMode, il fonctionnera aussi en production.

3. **Alternative** : Tu peux désactiver StrictMode en développement (non recommandé) :
   ```typescript
   // app/layout.tsx
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {process.env.NODE_ENV === 'production' ? (
             <StrictMode>{children}</StrictMode>
           ) : (
             children
           )}
         </body>
       </html>
     )
   }
   ```
   **Mais ce n'est pas recommandé** car tu perds les bénéfices de StrictMode.

## 🔧 Où cette protection est appliquée

- ✅ `app/(dashboard)/documents/page.tsx` - `reloadDocuments()`

Si tu vois d'autres appels doubles ailleurs, applique la même protection avec `useRef`.

## 📚 Références

- [React StrictMode Documentation](https://react.dev/reference/react/StrictMode)
- [Next.js StrictMode](https://nextjs.org/docs/app/api-reference/next-config-js/reactStrictMode)

**Date de création** : 2025-01-18  
**Branche** : `feature/session-auth`

