# Correction de l'erreur 500 lors de l'upload de document

## 🔍 Le problème

L'upload de document retournait une erreur 500 (Internal Server Error) côté frontend, alors que l'upload fonctionnait correctement avec curl côté backend.

**Erreur observée :**
```
[ErrorHandler] Server Error (500): Internal Server Error
{code: 500, message: 'Internal Server Error', details: {url: '/api/dakkom/api/v1/upload-document/', status: 500}}
```

## 🎯 La cause

Le backend Django attend le paramètre **`source`** dans le FormData, mais le frontend n'envoyait que le fichier.

**Requête curl qui fonctionne :**
```bash
curl.exe -X POST http://localhost:8000/api/v1/upload-document/ \
  -b cookies.txt \
  -H "X-CSRFToken: <token_csrf>" \
  -F "file=@document.pdf" \
  -F "source=INTERNAL"  # ← Ce paramètre était manquant côté frontend
```

**Valeurs possibles pour `source` :**
- `INTERNAL` : Document interne
- `WEB_PAGE` : Page web (nécessite aussi le paramètre `url`)
- `OTHER` : Autre source

## ✅ La solution

Ajout du paramètre `source=INTERNAL` dans le FormData côté frontend :

```typescript
// Avant
const form = new FormData()
form.append("file", entry.file)
await uploadDocument(form)

// Après
const form = new FormData()
form.append("file", entry.file)
form.append("source", "INTERNAL")  // ← Ajouté
await uploadDocument(form)
```

## 📝 Fichiers modifiés

- `components/documents/upload-document-dialog.tsx`
  - Ajout de `form.append("source", "INTERNAL")` pour les uploads simples
  - Ajout de `form.append("source", "INTERNAL")` pour les uploads batch
  - Amélioration de la gestion d'erreur avec `useErrorHandler`

## 🔧 Paramètres optionnels du backend

Le backend accepte aussi d'autres paramètres optionnels :

- `is_validated` (boolean) : Indique si le document est validé
- `is_qa` (boolean) : Indique si le document est Question-Answers
- `url` (string) : URL si source est WEB_PAGE

**Exemple avec tous les paramètres :**
```typescript
const form = new FormData()
form.append("file", entry.file)
form.append("source", "INTERNAL")
form.append("is_validated", "true")
form.append("is_qa", "false")
form.append("url", "")
```

## 🧪 Test

Pour tester l'upload :

1. Se connecter au dashboard avec un utilisateur admin/manager
2. Aller sur la page Documents
3. Cliquer sur "Upload Document"
4. Sélectionner un fichier (PDF, DOCX, TXT, MD)
5. Cliquer sur "Upload"

**Résultat attendu :**
- Toast de succès : "Upload successful"
- Le document apparaît dans la liste des documents
- Pas d'erreur 500

## 📚 Références

- Backend endpoint : `/api/v1/upload-document/`
- Documentation curl : Voir les tests backend fournis
- Formats supportés : PDF, DOCX, TXT, MD

**Date de création** : 2025-01-18  
**Branche** : `feature/session-auth`

