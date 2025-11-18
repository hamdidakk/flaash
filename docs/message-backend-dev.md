# Message pour le développeur backend - Clés API

Bonjour,

Le frontend Next.js a été configuré pour gérer les clés API avec une interface complète (création, rotation, révocation, audit). Actuellement, les endpoints backend correspondants ne sont pas encore implémentés, ce qui génère des erreurs 404.

## Endpoints à implémenter

Tous les endpoints doivent être accessibles sous `/auth_api/api_key/` :

1. **GET `/auth_api/api_key/`** - Liste des clés API (avec pagination et filtres)
2. **POST `/auth_api/api_key/`** - Création d'une clé API
3. **POST `/auth_api/api_key/{id}/rotate/`** - Rotation d'une clé API
4. **POST `/auth_api/api_key/{id}/revoke/`** - Révocation d'une clé API
5. **GET `/auth_api/api_key/events/`** - Liste des événements d'audit

## Spécifications détaillées

J'ai créé un document complet avec :
- Les formats de requêtes/réponses attendus
- Les champs de données requis
- Les codes d'erreur à retourner
- Des exemples d'implémentation Django REST Framework
- Les considérations de sécurité (hash des clés, stockage, etc.)

**Document :** `docs/backend-api-keys-requirements.md`

## Points importants

1. **Sécurité** : Ne jamais stocker les clés en clair, uniquement le hash (SHA-256)
2. **Clé complète** : Retourner la clé complète (`plain_text` ou `token`) **uniquement lors de la création**
3. **Audit** : Créer un événement d'audit pour chaque action (KEY_CREATED, KEY_ROTATED, KEY_REVOKED, ACCESS_GRANTED, ACCESS_DENIED)
4. **Authentification** : Tous les endpoints doivent vérifier la session Django + CSRF token
5. **Permissions** : Vérifier que l'utilisateur est `is_staff` ou a le rôle `admin`/`manager`

## Format des clés

Format recommandé : `sk-{prefix}-{random}` (ex: `sk-abc123-def456-ghi789`)
- Préfixe : 8-12 caractères aléatoires
- Partie aléatoire : 32+ caractères
- Stocker uniquement le hash dans la DB, le préfixe pour l'affichage

## Exemple de réponse pour la création

```json
{
  "key": {
    "id": 1,
    "prefix": "sk-abc123",
    "owner": "Acme Corp",
    "scope": "dashboard:read,dashboard:write",
    "rate_limit": 120,
    "is_active": true,
    "status": "active",
    "created_at": "2024-01-15T10:30:00Z",
    "expires_at": "2024-12-31T23:59:59Z"
  },
  "plain_text": "sk-abc123-def456-ghi789"
}
```

Le champ `plain_text` contient la clé complète **uniquement lors de la création** et ne doit jamais être retourné dans les autres endpoints.

## Questions ?

Si vous avez des questions sur les formats, les endpoints, ou la sécurité, n'hésitez pas à me contacter.

Merci !

