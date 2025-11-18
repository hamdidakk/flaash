# Explication : Clés API, Révocation et Throttling

## Qu'est-ce qu'une Clé API ?

Une **clé API** (Application Programming Interface Key) est un identifiant unique et secret utilisé pour authentifier et autoriser l'accès à une API (interface de programmation).

### Analogie simple
Imaginez une clé de maison :
- La **clé API** = votre clé physique
- L'**API** = votre maison
- Sans la clé, vous ne pouvez pas entrer
- Avec la clé, vous pouvez accéder aux fonctionnalités autorisées

### Dans notre contexte

1. **Authentification** : La clé API prouve que vous êtes autorisé à utiliser l'API
2. **Autorisation** : La clé définit ce que vous pouvez faire (scopes : `read`, `write`, etc.)
3. **Traçabilité** : Chaque utilisation est enregistrée (qui, quand, depuis quelle IP)

### Exemple concret

```
Clé API : sk-abc123-def456-ghi789
Owner : "Acme Corp"
Scope : "dashboard:read,dashboard:write"
Rate Limit : 120 requêtes/heure
```

Cette clé permet à "Acme Corp" de :
- Lire les données du dashboard (`dashboard:read`)
- Modifier les données du dashboard (`dashboard:write`)
- Faire jusqu'à 120 requêtes par heure

---

## Qu'est-ce que la Révocation ?

La **révocation** signifie **désactiver définitivement** une clé API. Une fois révoquée, la clé ne peut plus être utilisée.

### Pourquoi révoquer une clé ?

1. **Sécurité** : La clé a été compromise (volée, partagée par erreur)
2. **Fin de contrat** : Le partenaire/client ne doit plus avoir accès
3. **Rotation** : On crée une nouvelle clé et on révoque l'ancienne
4. **Erreur** : La clé a été créée par erreur ou avec de mauvais paramètres

### Différence : Révocation vs Désactivation

- **Désactivation** (`is_active: false`) : Temporaire, peut être réactivée
- **Révocation** (`status: "revoked"`) : **Permanente**, ne peut pas être réactivée

### Exemple

```
Avant révocation :
- Clé : sk-abc123-def456-ghi789
- Statut : active ✅
- Peut être utilisée : OUI

Après révocation :
- Clé : sk-abc123-def456-ghi789
- Statut : revoked ❌
- Peut être utilisée : NON (erreur 403 Forbidden)
```

---

## Scénarios de Test : Throttling (429/403)

### Prérequis pour tester le throttling

Le backend doit être configuré pour retourner `429 Too Many Requests` après un certain nombre de requêtes. Vérifiez avec votre développeur backend.

---

### Scénario 1 : Throttling sur le Login

**Objectif** : Vérifier que l'utilisateur est bloqué après trop de tentatives de connexion.

**Étapes** :
1. Aller sur `/login`
2. Entrer de **mauvais identifiants** (email/mot de passe incorrects)
3. Cliquer sur "Se connecter" **10 fois rapidement** (ou le nombre configuré côté backend)
4. ✅ **Résultat attendu** :
   - Une alerte rouge "Trop de requêtes" apparaît
   - Le bouton "Se connecter" est **désactivé**
   - Un bouton "Réessayer" apparaît dans l'alerte
   - Message : "Vous avez effectué trop de tentatives. Veuillez réessayer dans quelques minutes."

**Test de récupération** :
5. Attendre 1-2 minutes (ou le délai configuré)
6. Cliquer sur "Réessayer"
7. ✅ Le formulaire redevient utilisable
8. Entrer les **bons identifiants**
9. ✅ La connexion fonctionne

---

### Scénario 2 : Throttling sur le Dashboard (chargement du profil)

**Objectif** : Vérifier que le dashboard gère correctement le throttling.

**Étapes** :
1. Se connecter avec succès
2. Ouvrir **DevTools** → **Network**
3. Rafraîchir la page (`F5`) **plusieurs fois rapidement** (ou forcer un 429 via DevTools)
4. ✅ **Résultat attendu** :
   - Une alerte "Trop de requêtes" apparaît en haut de la page
   - Un bouton "Réessayer" permet de relancer le chargement du profil
   - Le dashboard reste visible mais avec l'alerte

**Test de récupération** :
5. Cliquer sur "Réessayer"
6. ✅ Le profil se charge correctement
7. ✅ L'alerte disparaît

---

### Scénario 3 : Throttling sur la Création de Clé API

**Objectif** : Vérifier que la création de clé API gère le throttling.

**Étapes** :
1. Aller sur `/security`
2. Cliquer sur "Créer une clé"
3. Remplir le formulaire
4. **Avant de cliquer sur "Créer"** :
   - Ouvrir DevTools → Network
   - Intercepter la requête POST vers `/api/auth-api/api_key/`
   - Modifier la réponse pour retourner `429` (ou forcer côté backend)
5. Cliquer sur "Créer"
6. ✅ **Résultat attendu** :
   - L'alerte throttling apparaît dans le dialogue
   - Le bouton "Créer" est désactivé
   - Message d'erreur clair

**Test de récupération** :
7. Cliquer sur "Réessayer"
8. ✅ Le formulaire redevient utilisable
9. Cliquer à nouveau sur "Créer" (sans forcer l'erreur)
10. ✅ La clé est créée avec succès

---

### Scénario 4 : Throttling sur l'Upload de Documents

**Objectif** : Vérifier que l'upload gère le throttling.

**Étapes** :
1. Aller sur `/documents`
2. Cliquer sur "Upload Document"
3. Sélectionner un fichier (PDF, DOCX, TXT, MD)
4. **Avant de cliquer sur "Upload"** :
   - Ouvrir DevTools → Network
   - Intercepter la requête POST vers `/api/v1/upload-document/`
   - Modifier la réponse pour retourner `429`
5. Cliquer sur "Upload"
6. ✅ **Résultat attendu** :
   - L'upload s'arrête
   - Une alerte throttling apparaît dans le dialogue
   - Le bouton "Upload" est désactivé
   - La barre de progression s'arrête

**Test de récupération** :
7. Cliquer sur "Réessayer"
8. ✅ L'upload peut reprendre
9. Cliquer à nouveau sur "Upload" (sans forcer l'erreur)
10. ✅ Le document est uploadé avec succès

---

### Scénario 5 : Throttling sur le Chat RAG (Privé)

**Objectif** : Vérifier que le chat gère le throttling.

**Étapes** :
1. Aller sur `/private-chat`
2. Envoyer **plusieurs messages rapidement** (ex: 5 messages en 10 secondes)
3. **Ou forcer un 429** :
   - Ouvrir DevTools → Network
   - Intercepter la requête POST vers `/api/v1/rag-generation/`
   - Modifier la réponse pour retourner `429`
4. Envoyer un message
5. ✅ **Résultat attendu** :
   - Le champ de saisie est **désactivé**
   - Une alerte throttling apparaît au-dessus du chat
   - Message : "Trop de requêtes. Veuillez patienter avant de réessayer."

**Test de récupération** :
6. Cliquer sur "Réessayer"
7. ✅ Le champ de saisie redevient actif
8. Envoyer un nouveau message (sans forcer l'erreur)
9. ✅ Le message est traité normalement

---

### Scénario 6 : Throttling sur le Widget Public

**Objectif** : Vérifier que le widget public gère le throttling.

**Étapes** :
1. Aller sur la page d'accueil (widget public)
2. Envoyer **plusieurs questions rapidement**
3. **Ou forcer un 429** :
   - Ouvrir DevTools → Network
   - Intercepter la requête POST vers `/api/v1/rag-generation/`
   - Modifier la réponse pour retourner `429`
4. Envoyer une question
5. ✅ **Résultat attendu** :
   - Le champ de saisie est **désactivé**
   - Les "Prompts Chips" sont **désactivés**
   - Une alerte throttling apparaît
   - Message clair pour l'utilisateur

**Test de récupération** :
6. Attendre quelques secondes
7. Cliquer sur "Réessayer"
8. ✅ Le widget redevient utilisable

---

### Scénario 7 : Redirection après Login vers URL demandée

**Objectif** : Vérifier que l'utilisateur est redirigé vers l'URL qu'il voulait accéder initialement.

**Étapes** :
1. **Sans être connecté**, aller directement sur `/settings` (ou `/security`, `/home`, etc.)
2. ✅ **Résultat attendu** :
   - Redirection automatique vers `/login?redirect=/settings`
   - Message contextuel si session expirée ou accès refusé

3. Se connecter avec un utilisateur **admin** ou **manager**
4. ✅ **Résultat attendu** :
   - Après connexion réussie, redirection automatique vers `/settings`
   - L'utilisateur arrive directement sur la page qu'il voulait

**Test avec utilisateur sans accès** :
5. Se déconnecter
6. Aller sur `/settings` (sans être connecté)
7. Se connecter avec un utilisateur **member** (sans accès dashboard)
8. ✅ **Résultat attendu** :
   - Après connexion, redirection vers `/chat` (ou page par défaut pour ce rôle)
   - **PAS** vers `/settings` car l'utilisateur n'a pas les permissions

---

## Comment forcer un 429 pour tester

### Méthode 1 : Via DevTools (Recommandé)

1. Ouvrir **DevTools** → **Network**
2. Cliquer sur l'onglet **Network**
3. Trouver la requête que vous voulez intercepter
4. Clic droit → **Copy** → **Copy as fetch**
5. Modifier le code pour retourner `429`
6. Exécuter dans la console :

```javascript
// Exemple : Forcer 429 sur /api/session/profile
fetch('/api/session/profile', {
  method: 'GET',
  credentials: 'include'
}).then(r => {
  console.log('Status:', r.status)
  // Si c'est 200, on peut forcer un 429 en modifiant la réponse
})
```

### Méthode 2 : Via le Backend (Plus réaliste)

Demander au développeur backend de :
1. Configurer DRF throttling pour retourner 429 après N requêtes
2. Tester avec un outil comme **Postman** ou **curl** pour envoyer plusieurs requêtes rapidement

### Méthode 3 : Via un Proxy (Avancé)

Utiliser un outil comme **Charles Proxy** ou **mitmproxy** pour intercepter et modifier les réponses.

---

## Checklist de Test Throttling

- [ ] Login : Alerte apparaît après trop de tentatives
- [ ] Dashboard : Alerte lors du chargement du profil
- [ ] Création clé API : Alerte dans le dialogue
- [ ] Upload documents : Alerte dans le dialogue
- [ ] Chat RAG privé : Alerte au-dessus du chat
- [ ] Widget public : Alerte dans le widget
- [ ] Bouton "Réessayer" fonctionne sur tous les cas
- [ ] Les champs/actions sont désactivés pendant le throttling
- [ ] Les messages d'erreur sont clairs et traduits (FR/EN)
- [ ] Redirection après login vers URL demandée fonctionne

---

**Date de création :** $(date)
**Branche :** `feature/session-auth`

