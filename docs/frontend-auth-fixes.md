# Corrections Frontend - Authentification API

## ✅ Corrections apportées

### 1. Proxy `/api/dakkom/[...path]` (`app/api/dakkom/[...path]/route.ts`)

**Problème :** Le proxy ne forwardait pas les cookies de session vers le backend.

**Corrections :**
- ✅ Forward des cookies du client vers le backend (header `cookie`)
- ✅ Forward du token CSRF (header `x-csrftoken`)
- ✅ Header `X-API-Key` envoyé uniquement s'il a une valeur valide (non vide, non null, non undefined)
- ✅ Forward des cookies de réponse (headers `set-cookie`) du backend vers le client

### 2. Routes d'évaluation (`app/api/evaluation/run/route.ts` et `app/api/evaluation/retrieval/route.ts`)

**Corrections :**
- ✅ Forward des cookies du client vers le backend
- ✅ Forward du token CSRF
- ✅ Header `X-API-Key` envoyé uniquement s'il a une valeur valide
- ✅ Forward des cookies de réponse

### 3. Client API Dakkom (`lib/dakkom-api.ts`)

**Corrections :**
- ✅ Vérification améliorée pour ne pas envoyer de header `X-API-Key` vide
- ✅ Utilise déjà `apiFetch` qui inclut `credentials: "include"` côté client

### 4. Client de session (`lib/session-client.ts`)

**Déjà conforme :**
- ✅ `sessionFetch` inclut déjà `credentials: "include"` pour toutes les requêtes
- ✅ Parsing amélioré des erreurs JSON (extraction de `detail`, `error`, `message`)

## 📋 Checklist de conformité

- [x] Toutes les requêtes API incluent `credentials: "include"` (via `sessionFetch` et `apiFetch`)
- [x] Le header `X-API-Key` n'est envoyé que s'il a une valeur valide (non vide, non null, non undefined)
- [x] Les cookies sont forwardés du client vers le backend dans tous les proxies
- [x] Les cookies de réponse sont forwardés du backend vers le client
- [x] Le token CSRF est forwardé dans tous les proxies

## 🔍 Points de vérification

### Dans les DevTools du navigateur :

1. **Onglet Network** :
   - Sélectionnez une requête vers `/api/dakkom/api/v1/document/list/`
   - Vérifiez l'onglet **Headers** → **Request Headers**
   - Vous devriez voir :
     - `Cookie: sessionid=...; csrftoken=...` (forwardé par le proxy)
     - Pas de `X-API-Key` (ou une valeur valide si configurée)

2. **Onglet Application/Storage** :
   - Vérifiez **Cookies** → `http://localhost:3000`
   - Vous devriez voir :
     - `sessionid` (cookie de session Django)
     - `csrftoken` (token CSRF)

3. **Console** :
   - Vérifiez qu'il n'y a pas d'erreurs CORS
   - Les warnings "Invalid API key" ne devraient plus apparaître si aucun header `X-API-Key` vide n'est envoyé

## 🧪 Test de vérification

1. **Se connecter** via `/login`
2. **Vérifier les cookies** dans DevTools → Application → Cookies
3. **Faire une requête API** (ex: lister les documents)
4. **Vérifier dans Network** que :
   - Les cookies sont bien envoyés (dans les Request Headers du proxy)
   - La réponse est 200 OK (pas 403)
   - Les cookies sont bien reçus (dans les Response Headers)

## 📝 Notes importantes

- Les proxies Next.js forwardent maintenant correctement les cookies bidirectionnellement
- L'authentification fonctionne en cascade : Session Django → API Key → Bearer Token
- Pour les endpoints dashboard, utilisez **uniquement l'authentification par session** (pas besoin d'API key)
- Les warnings "Invalid API key" ne devraient plus apparaître car on n'envoie plus de headers vides

## 🔄 Flux d'authentification

```
Client (Browser)
  ↓ credentials: "include"
Next.js Proxy (/api/dakkom/...)
  ↓ forward cookie header
Backend Django
  ↓ vérifie session → API key → Bearer token
  ↓ retourne réponse + set-cookie
Next.js Proxy
  ↓ forward set-cookie header
Client (Browser)
  ↓ reçoit et stocke les cookies
```

**Date de mise à jour** : 2025-01-18  
**Branche frontend** : `feature/session-auth`  
**Endpoints concernés** : Tous les endpoints via `/api/dakkom/` et `/api/evaluation/`

