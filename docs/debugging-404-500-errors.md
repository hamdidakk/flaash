# Débogage des erreurs 404 et 500 - API Dakkom

## 🔍 Comprendre les erreurs

### Erreur 404 (Not Found)

**Symptômes :**
- `Failed to load resource: the server responded with a status of 404 (Not Found)`
- URL dans la console : `/api/dakkom/api/v1/document/list/`

**Causes possibles :**

1. **Endpoint n'existe pas côté backend**
   - Vérifier que le backend Django a bien l'endpoint `/api/v1/document/list/`
   - Vérifier les URLs dans `server/urls.py` ou le routeur DRF

2. **Problème d'authentification**
   - Le backend peut retourner 404 au lieu de 403 si l'endpoint n'est pas trouvé à cause d'un problème d'authentification
   - Vérifier que les cookies de session sont bien présents et forwardés

3. **URL mal construite**
   - Vérifier dans les logs du proxy que l'URL upstream est correcte
   - Format attendu : `http://localhost:8000/api/v1/document/list/`

### Erreur 500 (Internal Server Error)

**Symptômes :**
- `Failed to load resource: the server responded with a status of 500 (Internal Server Error)`
- URL dans la console : `/api/dakkom/api/v1/upload-document`

**Causes possibles :**

1. **Erreur serveur Django**
   - Vérifier les logs du backend Django
   - Peut être une erreur de traitement (ex: fichier trop gros, format invalide)

2. **Problème d'authentification/permissions**
   - L'utilisateur n'a peut-être pas les permissions nécessaires
   - Vérifier le rôle de l'utilisateur (admin, manager, agent, member)

3. **Données invalides**
   - Vérifier le format des données envoyées
   - Vérifier les validations côté backend

4. **Problème spécifique à l'upload de documents**
   - **Fichier trop volumineux** : Vérifier la limite de taille côté backend
   - **Format de fichier non supporté** : Vérifier que le fichier est bien PDF, DOCX, TXT ou MD
   - **Collection non configurée** : L'erreur peut être "Collection not found" si aucune collection n'est configurée
   - **Problème de stockage** : Le backend peut avoir un problème d'accès au système de fichiers
   - **Timeout** : Le fichier peut être trop gros et causer un timeout

## 🛠️ Outils de débogage

### 1. Logs du proxy Next.js

En développement, le proxy log automatiquement les requêtes et erreurs :

```javascript
// Dans la console du navigateur ou du serveur Next.js
[dakkom-proxy] Request: {
  method: "GET",
  pathname: "/api/dakkom/api/v1/document/list/",
  extractedPath: "api/v1/document/list",
  upstreamPath: "api/v1/document/list/",
  upstream: "http://localhost:8000/api/v1/document/list/",
  hasCookies: true,
  hasApiKey: false
}

[dakkom-proxy] Error response: {
  status: 404,
  statusText: "Not Found",
  upstream: "http://localhost:8000/api/v1/document/list/",
  method: "GET",
  hasCookies: true,
  hasApiKey: false
}
```

### 2. Interprétation des logs dans la console du navigateur

**Logs `[ErrorHandler]` :**
- Format : `[ErrorHandler] Client Error (404): Collection not found...`
- Ces logs sont informatifs et indiquent qu'une erreur a été gérée et affichée via un toast
- Les erreurs 404 sont loggées avec `console.info` (moins bruyant)
- Les erreurs 500+ sont loggées avec `console.error`

**Logs `[dakkom-proxy]` :**
- Format : `[dakkom-proxy] Request: { method, pathname, upstream, ... }`
- Ces logs montrent l'URL exacte envoyée au backend
- Vérifier que `upstream` pointe vers le bon backend (ex: `http://localhost:8000/api/v1/document/list/`)

**Erreurs réseau dans la console :**
- `Failed to load resource: the server responded with a status of 404`
- C'est normal si l'endpoint n'existe pas encore côté backend
- L'erreur est déjà gérée et affichée via un toast dans l'UI

### 3. DevTools Network

1. Ouvrir **DevTools** → **Network**
2. Sélectionner la requête qui échoue
3. Vérifier :
   - **Request URL** : doit être `/api/dakkom/api/v1/...` (côté client, c'est normal)
   - **Request Headers** :
     - `Cookie: sessionid=...; csrftoken=...` (doit être présent)
     - Pas de `X-API-Key` (ou une valeur valide)
   - **Response** : voir le message d'erreur du backend

### 4. Vérification des cookies

1. Ouvrir **DevTools** → **Application** → **Cookies**
2. Vérifier que les cookies suivants sont présents :
   - `sessionid` (cookie de session Django)
   - `csrftoken` (token CSRF)

3. Vérifier que les cookies sont bien envoyés :
   - Dans **Network** → **Headers** → **Request Headers**
   - Le header `Cookie` doit contenir `sessionid` et `csrftoken`

## 🔧 Solutions

### Solution 1 : Vérifier que l'utilisateur est bien connecté

```typescript
// Dans la console du navigateur
document.cookie
// Devrait contenir : "sessionid=...; csrftoken=..."

// Vérifier le profil utilisateur
fetch('/api/session/profile', { credentials: 'include' })
  .then(r => r.json())
  .then(console.log)
```

### Solution 2 : Vérifier l'URL construite par le proxy

Les logs du proxy montrent l'URL exacte envoyée au backend. Vérifier que :
- `upstream` pointe vers le bon backend (ex: `http://localhost:8000`)
- Le chemin est correct (ex: `/api/v1/document/list/`)

### Solution 3 : Vérifier les permissions de l'utilisateur

L'utilisateur doit avoir un rôle valide :
- `admin` ou `manager` : accès complet au dashboard
- `agent` ou `member` : accès limité

Vérifier via :
```typescript
fetch('/api/session/profile', { credentials: 'include' })
  .then(r => r.json())
  .then(user => console.log('Role:', user.role))
```

### Solution 4 : Vérifier la configuration du backend

Vérifier que :
- Le backend Django tourne sur `http://localhost:8000`
- Les endpoints `/api/v1/document/list/` et `/api/v1/upload-document/` existent
- L'authentification par session est bien configurée

## 📋 Checklist de débogage

- [ ] Les cookies `sessionid` et `csrftoken` sont présents dans DevTools → Application → Cookies
- [ ] Les cookies sont envoyés avec la requête (vérifier dans Network → Headers)
- [ ] L'URL upstream dans les logs du proxy est correcte
- [ ] Le backend Django tourne et répond sur `http://localhost:8000`
- [ ] L'utilisateur a un rôle valide (admin, manager, agent, ou member)
- [ ] Les endpoints existent côté backend
- [ ] La variable d'environnement `NEXT_PUBLIC_DAKKOM_API_BASE_URL` pointe vers le bon backend

## 🆘 Si le problème persiste

1. **Vérifier les logs du backend Django** :
   - Regarder les erreurs dans la console Django
   - Vérifier les logs d'authentification

2. **Tester directement avec curl** :
   ```bash
   # Se connecter d'abord
   curl -X POST http://localhost:8000/auth/session/login/ \
     -H "Content-Type: application/json" \
     -d '{"username":"dashboard_admin","password":"Password"}' \
     -c cookies.txt
   
   # Tester l'endpoint
   curl -X GET http://localhost:8000/api/v1/document/list/ \
     -b cookies.txt
   ```

3. **Vérifier la configuration CORS** :
   - S'assurer que `CORS_ALLOWED_ORIGINS` contient `http://localhost:3000`
   - S'assurer que `CORS_ALLOW_CREDENTIALS=True`

## 📝 Notes importantes

- Les erreurs 404 peuvent parfois être des erreurs d'authentification déguisées
- Les erreurs 500 peuvent être causées par des problèmes de permissions
- Les logs du proxy (en développement) montrent exactement ce qui est envoyé au backend
- Les cookies doivent être forwardés dans **tous** les proxies Next.js

**Date de création** : 2025-01-18  
**Branche** : `feature/session-auth`

