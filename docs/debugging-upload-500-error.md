# Débogage de l'erreur 500 lors de l'upload de document

## 🔍 Le problème

L'upload de document retourne toujours une erreur 500 même après avoir ajouté le paramètre `source=INTERNAL`.

## 🛠️ Étapes de débogage

### 1. Vérifier les logs du proxy Next.js (terminal)

Quand tu uploades un fichier, tu devrais voir dans le terminal du serveur Next.js :

```
[dakkom-proxy] FormData upload: {
  method: 'POST',
  upstream: 'http://localhost:8000/api/v1/upload-document/',
  contentType: 'multipart/form-data; boundary=----WebKitFormBoundary...',
  hasBody: true
}

[dakkom-proxy] Error response: {
  status: 500,
  statusText: 'Internal Server Error',
  upstream: 'http://localhost:8000/api/v1/upload-document/',
  method: 'POST',
  hasCookies: true,
  hasApiKey: false,
  errorBody: '{"error": "...", "detail": "..."}'  // ← Message d'erreur du backend
}
```

**Vérifier :**
- ✅ `hasBody: true` : Le body est bien présent
- ✅ `contentType` : Le Content-Type inclut `multipart/form-data` et un `boundary`
- ✅ `hasCookies: true` : Les cookies de session sont présents
- ✅ `errorBody` : Le message d'erreur exact du backend

### 2. Vérifier les logs du backend Django

Dans le terminal où tourne le serveur Django, tu devrais voir l'erreur exacte :

```python
# Exemple d'erreur possible
ValueError: Missing required parameter 'source'
# ou
KeyError: 'source'
# ou
AttributeError: ...
```

**Actions :**
- Copier l'erreur exacte du backend
- Vérifier si c'est lié au paramètre `source` ou à autre chose

### 3. Vérifier dans DevTools → Network

1. Ouvrir **DevTools** → **Network**
2. Sélectionner la requête **POST** vers `/api/dakkom/api/v1/upload-document`
3. Vérifier :

**Request Headers :**
- `Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...`
- `Cookie: sessionid=...; csrftoken=...`
- `X-CSRFToken: ...`

**Request Payload :**
- Vérifier que le FormData contient :
  - `file: [File object]`
  - `source: INTERNAL`

**Response :**
- Vérifier le message d'erreur exact dans l'onglet "Response"

### 4. Tester avec curl pour comparer

Utilise la commande curl qui fonctionne pour comparer :

```bash
curl.exe -X POST http://localhost:8000/api/v1/upload-document/ \
  -b cookies.txt \
  -H "X-CSRFToken: <token_csrf>" \
  -F "file=@document.pdf" \
  -F "source=INTERNAL" \
  -v
```

**Comparer :**
- Les headers envoyés par curl vs ceux envoyés par le frontend
- Le format du FormData

## 🔧 Problèmes possibles et solutions

### Problème 1 : Le paramètre `source` n'est pas envoyé

**Symptôme :** Le backend retourne `Missing required parameter 'source'`

**Solution :** Vérifier que le code a bien été modifié dans `components/documents/upload-document-dialog.tsx` :

```typescript
form.append("file", entry.file)
form.append("source", "INTERNAL")  // ← Doit être présent
```

### Problème 2 : Le Content-Type n'est pas correctement préservé

**Symptôme :** Le backend ne peut pas parser le FormData

**Solution :** Le proxy doit préserver le Content-Type avec le boundary. Vérifier dans les logs du proxy que `contentType` inclut bien `multipart/form-data` et un `boundary`.

### Problème 3 : Le body n'est pas correctement transmis

**Symptôme :** Le backend reçoit un body vide ou corrompu

**Solution :** Vérifier dans les logs du proxy que `hasBody: true`. Si `hasBody: false`, le problème vient de la transmission du body.

### Problème 4 : Problème de CSRF token

**Symptôme :** Le backend retourne `CSRF Failed: CSRF token missing or incorrect`

**Solution :** Vérifier que :
- Les cookies sont bien présents (`hasCookies: true`)
- Le header `X-CSRFToken` est bien envoyé
- Le token CSRF est valide

### Problème 5 : Problème d'authentification/permissions

**Symptôme :** Le backend retourne `401 Unauthorized` ou `403 Forbidden`

**Solution :** Vérifier que :
- L'utilisateur est bien connecté
- L'utilisateur a le rôle `admin` ou `manager`
- Les cookies de session sont valides

## 📋 Checklist de débogage

- [ ] Les logs du proxy montrent `hasBody: true`
- [ ] Les logs du proxy montrent `contentType` avec `multipart/form-data` et un `boundary`
- [ ] Les logs du proxy montrent `hasCookies: true`
- [ ] Les logs du proxy montrent `errorBody` avec le message d'erreur du backend
- [ ] Les logs du backend Django montrent l'erreur exacte
- [ ] Dans DevTools → Network, le FormData contient `file` et `source`
- [ ] Dans DevTools → Network, les headers contiennent `Cookie` et `X-CSRFToken`
- [ ] Le test avec curl fonctionne correctement

## 🆘 Si le problème persiste

1. **Comparer les requêtes curl vs frontend :**
   - Utiliser un outil comme Postman ou Insomnia pour capturer la requête curl
   - Comparer avec la requête du frontend dans DevTools → Network
   - Identifier les différences

2. **Vérifier la version de Next.js :**
   - Certaines versions peuvent avoir des problèmes avec `request.body` et FormData
   - Vérifier la documentation Next.js pour les limitations

3. **Tester avec un fichier plus petit :**
   - Si ça fonctionne avec un petit fichier, le problème pourrait être lié à la taille
   - Vérifier les limites de taille côté backend

4. **Vérifier les logs complets :**
   - Activer les logs détaillés dans Django (`DEBUG=True`)
   - Vérifier tous les logs du proxy et du backend

**Date de création** : 2025-01-18  
**Branche** : `feature/session-auth`

