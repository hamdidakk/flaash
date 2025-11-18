# Requirements Backend - Gestion des Clés API

## Contexte

Le frontend Next.js a été configuré pour gérer les clés API avec une interface complète (création, rotation, révocation, audit). Actuellement, les endpoints backend correspondants ne sont pas encore implémentés, ce qui génère des erreurs 404.

## Endpoints à implémenter

### Base URL
Tous les endpoints doivent être accessibles sous `/auth_api/api_key/` (ou selon votre convention d'URL).

### 1. Liste des clés API

**Endpoint:** `GET /auth_api/api_key/`

**Paramètres de requête (optionnels):**
- `search` (string) : Recherche par owner, scope, label
- `owner` (string) : Filtrer par propriétaire
- `scope` (string) : Filtrer par scope
- `is_active` (boolean) : Filtrer par statut actif/inactif
- `limit` (integer, défaut: 20) : Nombre de résultats par page
- `offset` (integer, défaut: 0) : Offset pour la pagination

**Réponse attendue (200 OK):**
```json
{
  "results": [
    {
      "id": 1,
      "prefix": "sk-abc123",
      "label": "Clé de production",
      "owner": "Acme Corp",
      "scope": "dashboard:read,dashboard:write",
      "rate_limit": 120,
      "is_active": true,
      "last_used_at": "2024-01-15T10:30:00Z",
      "last_rotated_at": "2024-01-10T08:00:00Z",
      "created_at": "2024-01-01T00:00:00Z",
      "expires_at": "2024-12-31T23:59:59Z",
      "status": "active"
    }
  ],
  "count": 1,
  "next": null,
  "previous": null
}
```

**Champs importants:**
- `id` : Identifiant unique de la clé
- `prefix` : Préfixe de la clé (ex: "sk-abc123") - la clé complète n'est jamais retournée en liste
- `owner` : Propriétaire/nom de la clé
- `scope` : String ou array de scopes (ex: "dashboard:read" ou ["dashboard:read", "dashboard:write"])
- `rate_limit` : Limite de requêtes par minute (null = illimité)
- `is_active` : Boolean indiquant si la clé est active
- `status` : "active" | "inactive" | "revoked"
- `last_used_at` : Date ISO de dernière utilisation (nullable)
- `last_rotated_at` : Date ISO de dernière rotation (nullable)
- `expires_at` : Date ISO d'expiration (nullable)

---

### 2. Création d'une clé API

**Endpoint:** `POST /auth_api/api_key/`

**Headers requis:**
- `Content-Type: application/json`
- `X-CSRFToken` : Token CSRF (si session-based auth)
- Cookie `sessionid` : Session Django (si session-based auth)

**Body (JSON):**
```json
{
  "owner": "Acme Corp",
  "scope": "dashboard:read,dashboard:write",
  "rate_limit": 120,
  "expires_at": "2024-12-31T23:59:59Z",
  "notes": "Clé pour intégration production"
}
```

**Champs:**
- `owner` (string, requis) : Propriétaire/nom de la clé
- `scope` (string ou array, requis) : Scopes autorisés (ex: "dashboard:read" ou ["dashboard:read", "dashboard:write"])
- `rate_limit` (integer, optionnel) : Limite de requêtes par minute
- `expires_at` (string ISO 8601, optionnel) : Date d'expiration
- `notes` (string, optionnel) : Notes/métadonnées

**Réponse attendue (201 Created):**
```json
{
  "key": {
    "id": 1,
    "prefix": "sk-abc123",
    "owner": "Acme Corp",
    "scope": "dashboard:read,dashboard:write",
    "rate_limit": 120,
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z",
    "expires_at": "2024-12-31T23:59:59Z",
    "status": "active"
  },
  "plain_text": "sk-abc123-def456-ghi789",
  "token": "sk-abc123-def456-ghi789"
}
```

**Important:** 
- Le champ `plain_text` ou `token` contient la clé complète **uniquement lors de la création**
- Cette valeur ne doit **jamais** être retournée dans les autres endpoints
- Le frontend affiche cette valeur une seule fois à l'utilisateur

---

### 3. Rotation d'une clé API

**Endpoint:** `POST /auth_api/api_key/{id}/rotate/`

**Headers requis:**
- `Content-Type: application/json`
- `X-CSRFToken` : Token CSRF
- Cookie `sessionid` : Session Django

**Body (JSON, optionnel):**
```json
{
  "reason": "Rotation de sécurité mensuelle"
}
```

**Réponse attendue (200 OK):**
```json
{
  "key": {
    "id": 1,
    "prefix": "sk-xyz789",
    "owner": "Acme Corp",
    "scope": "dashboard:read,dashboard:write",
    "is_active": false,
    "status": "inactive",
    "last_rotated_at": "2024-01-15T10:35:00Z"
  },
  "plain_text": "sk-xyz789-abc123-def456",
  "token": "sk-xyz789-abc123-def456"
}
```

**Comportement attendu:**
- L'ancienne clé est désactivée (`is_active: false`, `status: "inactive"`)
- Une nouvelle clé est générée avec un nouveau préfixe
- La nouvelle clé complète est retournée dans `plain_text`/`token`
- Un événement d'audit `KEY_ROTATED` est créé

---

### 4. Révocation d'une clé API

**Endpoint:** `POST /auth_api/api_key/{id}/revoke/`

**Headers requis:**
- `Content-Type: application/json`
- `X-CSRFToken` : Token CSRF
- Cookie `sessionid` : Session Django

**Body (JSON, optionnel):**
```json
{
  "reason": "Clé compromise"
}
```

**Réponse attendue (200 OK):**
```json
{
  "id": 1,
  "prefix": "sk-abc123",
  "owner": "Acme Corp",
  "is_active": false,
  "status": "revoked",
  "last_rotated_at": null
}
```

**Comportement attendu:**
- La clé est marquée comme révoquée (`status: "revoked"`, `is_active: false`)
- La clé ne peut plus être utilisée pour authentifier les requêtes
- Un événement d'audit `KEY_REVOKED` est créé
- La révocation est **permanente** (contrairement à la désactivation qui peut être réversible)

---

### 5. Liste des événements d'audit

**Endpoint:** `GET /auth_api/api_key/events/`

**Paramètres de requête (optionnels):**
- `api_key_id` (integer) : Filtrer par ID de clé
- `event_type` (string) : Filtrer par type d'événement
- `ip_address` (string) : Filtrer par adresse IP
- `limit` (integer, défaut: 20) : Nombre de résultats par page
- `offset` (integer, défaut: 0) : Offset pour la pagination

**Types d'événements attendus:**
- `KEY_CREATED` : Clé créée
- `KEY_ROTATED` : Clé rotatée
- `KEY_REVOKED` : Clé révoquée
- `ACCESS_GRANTED` : Accès autorisé (authentification réussie)
- `ACCESS_DENIED` : Accès refusé (authentification échouée)

**Réponse attendue (200 OK):**
```json
{
  "results": [
    {
      "id": 1,
      "api_key_id": 1,
      "api_key_owner": "Acme Corp",
      "event_type": "KEY_CREATED",
      "created_at": "2024-01-15T10:30:00Z",
      "ip_address": "192.168.1.100",
      "user_agent": "Mozilla/5.0...",
      "metadata": {
        "scope": "dashboard:read,dashboard:write",
        "rate_limit": 120
      }
    },
    {
      "id": 2,
      "api_key_id": 1,
      "api_key_owner": "Acme Corp",
      "event_type": "ACCESS_GRANTED",
      "created_at": "2024-01-15T11:00:00Z",
      "ip_address": "192.168.1.101",
      "user_agent": "curl/7.68.0",
      "metadata": {
        "endpoint": "/api/v1/documents/",
        "method": "GET"
      }
    }
  ],
  "count": 2,
  "next": null,
  "previous": null
}
```

**Champs:**
- `id` : Identifiant unique de l'événement
- `api_key_id` : ID de la clé concernée (nullable pour certains événements)
- `api_key_owner` : Propriétaire de la clé (pour faciliter l'affichage)
- `event_type` : Type d'événement (voir liste ci-dessus)
- `created_at` : Date ISO de l'événement
- `ip_address` : Adresse IP de la requête (nullable)
- `user_agent` : User-Agent de la requête (nullable)
- `metadata` : Objet JSON libre pour stocker des informations supplémentaires

---

## Authentification et autorisation

### Session-based authentication
Tous les endpoints doivent :
1. Vérifier la session Django (`request.user.is_authenticated`)
2. Vérifier le token CSRF (`X-CSRFToken` header)
3. Vérifier que l'utilisateur a les permissions nécessaires (ex: `is_staff` ou rôle `admin`/`manager`)

### Exemple de middleware/permission
```python
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

@permission_classes([IsAuthenticated])
def api_key_list(request):
    # Vérifier que l'utilisateur est staff ou a le rôle approprié
    if not request.user.is_staff:
        return Response({"error": "Permission denied"}, status=403)
    # ...
```

---

## Gestion des erreurs

### Erreurs attendues

**400 Bad Request** : Données invalides
```json
{
  "error": "Owner and scope are required"
}
```

**401 Unauthorized** : Session expirée ou non authentifiée
```json
{
  "error": "Authentication required"
}
```

**403 Forbidden** : Permissions insuffisantes
```json
{
  "error": "Permission denied"
}
```

**404 Not Found** : Clé non trouvée (pour rotate/revoke)
```json
{
  "error": "API key not found"
}
```

**429 Too Many Requests** : Rate limit dépassé
```json
{
  "error": "Rate limit exceeded",
  "retry_after": 60
}
```

**500 Internal Server Error** : Erreur serveur
```json
{
  "error": "Internal server error"
}
```

---

## Sécurité

### Génération des clés
- Utiliser un générateur cryptographiquement sûr (ex: `secrets.token_urlsafe()` en Python)
- Format recommandé : `sk-{prefix}-{random}` (ex: `sk-abc123-def456-ghi789`)
- Longueur minimale : 32 caractères
- Stocker uniquement le hash de la clé dans la base de données (jamais en clair)

### Stockage
- **Ne jamais** stocker la clé complète en clair
- Stocker uniquement le hash (SHA-256 ou bcrypt)
- Stocker le préfixe pour l'affichage (ex: `sk-abc123`)

### Validation
- Vérifier le format de la clé lors de l'authentification
- Vérifier les scopes avant d'autoriser l'accès à un endpoint
- Vérifier le rate limit avant de traiter la requête
- Vérifier la date d'expiration

---

## Exemple d'implémentation Django REST Framework

```python
# models.py
from django.db import models
from django.contrib.auth.models import User
import secrets

class APIKey(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('revoked', 'Revoked'),
    ]
    
    owner = models.CharField(max_length=255)
    scope = models.JSONField()  # Array de scopes
    rate_limit = models.IntegerField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    prefix = models.CharField(max_length=50, unique=True)
    key_hash = models.CharField(max_length=255)  # Hash de la clé complète
    created_at = models.DateTimeField(auto_now_add=True)
    last_used_at = models.DateTimeField(null=True, blank=True)
    last_rotated_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    def generate_key(self):
        """Génère une nouvelle clé et retourne la clé complète"""
        prefix = f"sk-{secrets.token_urlsafe(8)[:8]}"
        random_part = secrets.token_urlsafe(32)
        full_key = f"{prefix}-{random_part}"
        self.prefix = prefix
        self.key_hash = hashlib.sha256(full_key.encode()).hexdigest()
        return full_key

# serializers.py
from rest_framework import serializers
from .models import APIKey

class APIKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = APIKey
        fields = ['id', 'prefix', 'owner', 'scope', 'rate_limit', 
                  'is_active', 'status', 'last_used_at', 'last_rotated_at',
                  'created_at', 'expires_at']

# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_key_list(request):
    if not request.user.is_staff:
        return Response({"error": "Permission denied"}, status=403)
    
    keys = APIKey.objects.all()
    # Appliquer les filtres (search, owner, scope, is_active, etc.)
    serializer = APIKeySerializer(keys, many=True)
    return Response({
        "results": serializer.data,
        "count": keys.count(),
        "next": None,
        "previous": None
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_key_create(request):
    if not request.user.is_staff:
        return Response({"error": "Permission denied"}, status=403)
    
    key = APIKey.objects.create(
        owner=request.data.get('owner'),
        scope=request.data.get('scope'),
        rate_limit=request.data.get('rate_limit'),
        expires_at=request.data.get('expires_at'),
        notes=request.data.get('notes', '')
    )
    full_key = key.generate_key()
    key.save()
    
    serializer = APIKeySerializer(key)
    return Response({
        "key": serializer.data,
        "plain_text": full_key
    }, status=201)
```

---

## Notes importantes

1. **Pagination** : Tous les endpoints de liste doivent supporter la pagination avec `limit` et `offset`
2. **Filtrage** : Les endpoints de liste doivent supporter les filtres mentionnés
3. **Tri** : Par défaut, trier par `created_at` décroissant (plus récent en premier)
4. **Audit** : Créer un événement d'audit pour chaque action (création, rotation, révocation, authentification)
5. **CORS** : S'assurer que les headers CORS sont correctement configurés pour le frontend Next.js
6. **CSRF** : Tous les endpoints POST/PUT/PATCH/DELETE doivent vérifier le token CSRF

---

## Questions ou clarifications

Si vous avez des questions sur les formats de données, les endpoints, ou la sécurité, n'hésitez pas à me contacter.

**Date de création :** $(date)
**Frontend branch :** `feature/session-auth`

