# Guide de Test Manuel - Branche `feature/session-auth`

Ce guide couvre toutes les nouvelles fonctionnalités ajoutées dans cette branche par rapport à `dev`.

## Prérequis

1. **Backend Django** doit être démarré sur `http://localhost:8000`
2. **Frontend Next.js** doit être démarré sur `http://localhost:3000`
3. **Base de données** avec au moins un utilisateur de test (admin/manager/agent/member)
4. **Variables d'environnement** configurées :
   - `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`
   - `BACKEND_URL=http://localhost:8000` (pour le proxy)

---

## 1. Audit et Gestion des Clés API

### 1.1 Accès à la page Sécurité

**Test :**
- Naviguer vers `/security` (ou via sidebar → "Clés API")
- ✅ La page doit s'afficher avec :
  - En-tête "Clés API" avec bouton "Créer une clé"
  - 4 cartes de statistiques (Total, Actives, Inactives, Révoquées)
  - Tableau des clés avec colonnes : Owner, Scope, Rate Limit, Dernière utilisation, Statut, Actions
  - Section "Événements d'audit" avec tableau des logs

### 1.2 Création d'une clé API

**Test :**
1. Cliquer sur "Créer une clé"
2. Remplir le formulaire :
   - Owner : `Test User`
   - Scope : `dashboard:read,dashboard:write` (ou un seul scope)
   - Rate Limit : `120` (optionnel)
   - Date d'expiration : sélectionner une date future (optionnel)
   - Notes : `Clé de test` (optionnel)
3. Cliquer sur "Créer"
4. ✅ Une carte verte doit apparaître avec :
   - Le secret en clair (ex: `sk-xxxxx-xxxxx-xxxxx`)
   - Bouton "Copier"
   - Avertissement "Cette clé ne sera plus visible après fermeture"
   - Informations Owner et Scope

**Vérifications :**
- ✅ La clé apparaît dans le tableau avec statut "active"
- ✅ Les statistiques se mettent à jour (Total +1, Actives +1)
- ✅ Un événement "KEY_CREATED" apparaît dans la section Audit

### 1.3 Rotation d'une clé API

**Test :**
1. Dans le tableau, trouver une clé active
2. Cliquer sur l'icône "Rotate" (flèche circulaire)
3. Confirmer l'action
4. ✅ Une nouvelle carte verte apparaît avec le nouveau secret
5. ✅ L'ancienne clé est toujours visible mais marquée comme "inactive"
6. ✅ Un événement "KEY_ROTATED" apparaît dans l'audit

### 1.4 Révocation d'une clé API

**Test :**
1. Dans le tableau, trouver une clé active
2. Cliquer sur l'icône "Revoke" (corbeille)
3. Confirmer l'action
4. ✅ La clé passe au statut "revoked" (badge rouge)
5. ✅ Les statistiques se mettent à jour (Révoquées +1, Actives -1)
6. ✅ Un événement "KEY_REVOKED" apparaît dans l'audit

### 1.5 Filtrage et recherche

**Test :**
1. Utiliser le champ de recherche pour filtrer par owner
2. Utiliser le filtre "Statut" (Tous / Actives / Inactives / Révoquées)
3. ✅ Le tableau se met à jour en temps réel
4. ✅ Les statistiques restent cohérentes avec les filtres

### 1.6 Consultation des événements d'audit

**Test :**
1. Dans la section "Événements d'audit", vérifier :
   - Colonnes : Type, Clé API, IP, Date
   - Types d'événements : `KEY_CREATED`, `KEY_ROTATED`, `KEY_REVOKED`, `ACCESS_GRANTED`, `ACCESS_DENIED`
2. ✅ Les événements sont triés par date (plus récent en premier)
3. ✅ Les événements correspondent aux actions effectuées

---

## 2. Authentification JWT Partenaires

### 2.1 Accès à la configuration

**Test :**
- Naviguer vers `/settings` (ou via sidebar → "Paramètres")
- ✅ Une nouvelle section "Authentification Partenaires" doit apparaître
- ✅ La carte affiche :
  - Formulaire avec champs : Partner ID, Partner Secret, Scopes, Audience
  - État actuel (Non configuré / Configuré / Authentifié)
  - Boutons : "Enregistrer", "Tester la connexion", "Rafraîchir", "Effacer"

### 2.2 Configuration initiale

**Test :**
1. Remplir le formulaire :
   - Partner ID : `test-partner-123`
   - Partner Secret : `secret-key-456`
   - Scopes : `read,write` (séparés par virgules)
   - Audience : `https://api.example.com` (optionnel)
2. Cliquer sur "Enregistrer"
3. ✅ Un toast de succès apparaît
4. ✅ L'état passe à "Configuré"
5. ✅ Les champs sont désactivés (verrouillés)

### 2.3 Test de connexion (obtention du token)

**Test :**
1. Avec une configuration valide, cliquer sur "Tester la connexion"
2. ✅ Un spinner apparaît pendant la requête
3. ✅ Si succès :
   - L'état passe à "Authentifié"
   - Badge vert "Token actif"
   - Affichage de la date d'expiration
   - Bouton "Rafraîchir" devient actif
4. ✅ Si échec :
   - Message d'erreur clair (ex: "Identifiants invalides")
   - État reste "Configuré"

### 2.4 Rafraîchissement du token

**Test :**
1. Attendre que le token soit proche de l'expiration (ou forcer via DevTools)
2. Cliquer sur "Rafraîchir"
3. ✅ Un nouveau token est obtenu
4. ✅ La date d'expiration est mise à jour

### 2.5 Effacement de la configuration

**Test :**
1. Cliquer sur "Effacer"
2. Confirmer l'action
3. ✅ La configuration est supprimée
4. ✅ Les tokens sont effacés du localStorage
5. ✅ L'état revient à "Non configuré"
6. ✅ Les champs redeviennent éditables

---

## 3. Gestion des Erreurs Throttling (429/403)

### 3.1 Test sur le login

**Test :**
1. Aller sur `/login`
2. Tenter plusieurs connexions avec de mauvais identifiants (simuler brute-force)
3. ✅ Après plusieurs tentatives, une alerte "Trop de requêtes" apparaît
4. ✅ Le bouton "Se connecter" est désactivé
5. ✅ Un bouton "Réessayer" apparaît dans l'alerte
6. ✅ Cliquer sur "Réessayer" réactive le formulaire

**Note :** Pour forcer un 429, vous pouvez :
- Utiliser un outil comme Postman pour envoyer 10+ requêtes rapidement
- Modifier temporairement le backend pour retourner 429 après N tentatives

### 3.2 Test sur le dashboard (chargement du profil)

**Test :**
1. Se connecter avec succès
2. Forcer un 429 sur `/api/session/profile` (via DevTools Network → Block request)
3. Rafraîchir la page (`F5`)
4. ✅ Une alerte "Trop de requêtes" apparaît en haut de la page
5. ✅ Un bouton "Réessayer" permet de relancer `loadProfile()`

### 3.3 Test sur la création de clé API

**Test :**
1. Aller sur `/security`
2. Tenter de créer plusieurs clés rapidement (ou forcer un 429)
3. ✅ Une alerte throttling apparaît au-dessus du formulaire
4. ✅ Le bouton "Créer" est désactivé
5. ✅ Après "Réessayer", le formulaire redevient utilisable

### 3.4 Test sur l'upload de documents

**Test :**
1. Aller sur `/documents`
2. Ouvrir le dialogue "Upload Document"
3. Sélectionner un fichier
4. Forcer un 429 sur l'endpoint d'upload (via DevTools)
5. Cliquer sur "Upload"
6. ✅ L'upload s'arrête
7. ✅ Une alerte throttling apparaît dans le dialogue
8. ✅ Le bouton "Upload" est désactivé
9. ✅ Après "Réessayer", l'upload peut reprendre

### 3.5 Test sur le chat RAG (privé)

**Test :**
1. Aller sur `/private-chat`
2. Envoyer plusieurs messages rapidement
3. Forcer un 429 sur `/api/v1/rag-generation/`
4. ✅ Le champ de saisie est désactivé
5. ✅ Une alerte throttling apparaît au-dessus du chat
6. ✅ Après "Réessayer", le chat redevient utilisable

### 3.6 Test sur le widget public

**Test :**
1. Aller sur la page d'accueil (widget public)
2. Envoyer plusieurs questions rapidement
3. Forcer un 429 sur l'endpoint public
4. ✅ Le champ de saisie est désactivé
5. ✅ Une alerte throttling apparaît
6. ✅ Les prompts chips sont désactivés

---

## 4. Améliorations Session/Auth et Rôles

### 4.1 Redirection après login selon le rôle

**Test :**
1. Se connecter avec un utilisateur `admin` ou `manager`
2. ✅ Redirection vers `/home` (dashboard)
3. Se déconnecter
4. Se connecter avec un utilisateur `agent` ou `member`
5. ✅ Redirection vers `/chat` (ou page par défaut pour ces rôles)

**Vérification :**
- Vérifier dans la console que `useSessionStore` contient bien `user.role`

### 4.2 Protection du dashboard par rôle

**Test :**
1. Se connecter avec un utilisateur `member` (non-dashboard)
2. Essayer d'accéder à `/home` ou `/security`
3. ✅ Une page d'erreur 403 s'affiche avec message "Accès refusé"
4. ✅ Le sidebar ne doit pas afficher les liens dashboard (ou les désactiver)

### 4.3 Persistance de session après refresh

**Test :**
1. Se connecter avec succès
2. Naviguer vers `/home`
3. Rafraîchir la page (`F5`)
4. ✅ La session persiste (pas de redirection vers `/login`)
5. ✅ Les données utilisateur sont toujours affichées

### 4.4 Expiration de session

**Test :**
1. Se connecter avec succès
2. Attendre l'expiration de la session (ou forcer via backend)
3. Rafraîchir la page ou naviguer vers une page protégée
4. ✅ Redirection vers `/login?reason=session-expired`
5. ✅ Un message contextuel s'affiche : "Votre session a expiré"

### 4.5 Gestion des erreurs CSRF

**Test :**
1. Se connecter avec succès
2. Ouvrir DevTools → Application → Cookies
3. Supprimer le cookie `csrftoken`
4. Tenter une action (ex: logout, création clé API)
5. ✅ L'erreur est gérée proprement (pas de crash)
6. ✅ Un message d'erreur approprié s'affiche

---

## 5. Tests de régression (vérifier que l'existant fonctionne)

### 5.1 Navigation générale

**Test :**
- ✅ Tous les liens du sidebar fonctionnent
- ✅ Le header avec menu utilisateur fonctionne
- ✅ Le changement de langue fonctionne

### 5.2 Fonctionnalités existantes

**Test :**
- ✅ Upload de documents fonctionne (sans throttling)
- ✅ Chat RAG fonctionne normalement
- ✅ Recherche de documents fonctionne
- ✅ Paramètres généraux fonctionnent

---

## 6. Checklist finale

Avant de considérer les tests comme terminés, vérifier :

- [ ] Toutes les nouvelles pages sont accessibles (`/security`, `/settings` avec section partenaires)
- [ ] Toutes les actions CRUD sur les clés API fonctionnent
- [ ] Les événements d'audit sont enregistrés et affichés
- [ ] La configuration partenaire fonctionne (save, test, refresh, clear)
- [ ] Les alertes throttling apparaissent sur tous les flux critiques
- [ ] Les redirections selon les rôles fonctionnent
- [ ] La session persiste après refresh
- [ ] Les erreurs sont gérées proprement (pas de crash, messages clairs)
- [ ] Les traductions EN/FR sont présentes pour toutes les nouvelles chaînes
- [ ] Aucune erreur dans la console du navigateur (sauf celles volontairement provoquées)

---

## Notes pour le développeur backend

Pour tester complètement, le backend doit exposer :

1. **Endpoints clés API** :
   - `GET /auth_api/api_key/` (liste paginée)
   - `POST /auth_api/api_key/` (création)
   - `POST /auth_api/api_key/{id}/rotate/` (rotation)
   - `POST /auth_api/api_key/{id}/revoke/` (révocation)
   - `GET /auth_api/api_key/events/` (audit)

2. **Endpoints partenaires** :
   - `POST /auth/partner/token` (obtention token)
   - `POST /auth/partner/refresh` (refresh token)

3. **Throttling** :
   - Configurer DRF throttling pour retourner 429 après N requêtes
   - Tester sur `/auth/session/login`, `/auth/session/profile`, endpoints API keys, etc.

4. **Rôles utilisateur** :
   - S'assurer que les utilisateurs ont bien le champ `role` (admin/manager/agent/member)
   - Vérifier que `is_staff` est cohérent avec les rôles

---

## Commandes utiles

```bash
# Démarrer le frontend
pnpm dev

# Démarrer le backend (dans un autre terminal)
# (selon votre setup Django)

# Vérifier les logs
# Ouvrir DevTools → Network pour voir les requêtes
# Ouvrir DevTools → Console pour voir les erreurs
```

---

**Date de création :** $(date)
**Branche :** `feature/session-auth`
**Auteur :** Guide généré automatiquement

