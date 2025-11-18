# Comment vérifier que les fonts sont bien appliquées dans le header

## Méthode 1 : DevTools du navigateur (recommandé)

### Étapes :

1. **Ouvrir la page publique** (ex: `http://localhost:3000`)

2. **Ouvrir les DevTools** :
   - Appuyer sur `F12`
   - Ou clic droit → "Inspecter"
   - Ou `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)

3. **Sélectionner un élément du header** :
   - Cliquer sur l'icône de sélection (en haut à gauche des DevTools)
   - Ou utiliser `Ctrl+Shift+C` (Windows) / `Cmd+Shift+C` (Mac)
   - Cliquer sur un lien de navigation dans le header (ex: "Accueil", "Thématiques")

4. **Vérifier la font dans l'onglet "Computed"** :
   - Dans le panneau de droite, aller dans l'onglet "Computed"
   - Chercher la propriété `font-family`
   - **Résultat attendu** : `"Neue Machina Inktrap", sans-serif`
   - Si les fichiers de fonts ne sont pas encore chargés, tu verras : `sans-serif` (font de fallback)

5. **Vérifier dans l'onglet "Styles"** :
   - Dans le panneau de droite, aller dans l'onglet "Styles"
   - Chercher les règles CSS appliquées
   - Tu devrais voir : `font-family: var(--font-family-sans);`
   - Ou directement : `font-family: "Neue Machina Inktrap", sans-serif;`

## Méthode 2 : Console JavaScript

1. **Ouvrir la console** (onglet "Console" dans les DevTools)

2. **Exécuter cette commande** :
```javascript
// Vérifier la font appliquée sur un élément du header
const headerNav = document.querySelector('.public-header__nav');
if (headerNav) {
  const computedStyle = window.getComputedStyle(headerNav);
  console.log('Font du header:', computedStyle.fontFamily);
  console.log('Font attendue: "Neue Machina Inktrap", sans-serif');
}
```

3. **Résultat attendu** :
```
Font du header: "Neue Machina Inktrap", sans-serif
Font attendue: "Neue Machina Inktrap", sans-serif
```

## Méthode 3 : Vérification des fichiers de fonts

1. **Vérifier que les fichiers de fonts existent** :
   - Aller dans `public/fonts/`
   - Vérifier que les fichiers suivants existent :
     - `NeueMachinaInktrap-Regular.woff2` (ou `.woff`)
     - `NeueMachinaInktrap-Medium.woff2` (ou `.woff`)
     - `NeueMachinaInktrap-Bold.woff2` (ou `.woff`)

2. **Vérifier dans l'onglet "Network"** :
   - Ouvrir les DevTools → onglet "Network"
   - Filtrer par "Font"
   - Recharger la page
   - Vérifier que les fichiers de fonts sont chargés (statut 200)

## Méthode 4 : Comparaison visuelle

1. **Comparer avec le dashboard** :
   - Ouvrir une page publique (ex: `/`)
   - Ouvrir une page dashboard (ex: `/home`)
   - Comparer visuellement les fonts du header
   - Le header public devrait avoir une apparence différente (plus moderne/geometric avec Neue Machina Inktrap)
   - Le dashboard devrait utiliser Inter (plus classique)

## Problèmes possibles

### Si tu vois `sans-serif` au lieu de `"Neue Machina Inktrap"` :

1. **Les fichiers de fonts ne sont pas encore ajoutés** :
   - Ajouter les fichiers dans `public/fonts/`
   - Vérifier les noms de fichiers (doivent correspondre exactement aux noms dans `@font-face`)

2. **Les fichiers de fonts ne sont pas chargés** :
   - Vérifier dans l'onglet "Network" si les fonts sont chargées
   - Vérifier les erreurs 404 dans la console

3. **Les variables CSS ne sont pas définies** :
   - Vérifier dans `app/globals.css` que `--font-family-sans` est bien défini
   - Vérifier que la classe `.public-site` est appliquée sur le `<body>`

### Si tu vois toujours Inter :

1. **Vérifier que la classe `.public-site` est appliquée** :
   - Dans les DevTools, inspecter le `<body>`
   - Vérifier qu'il a la classe `public-site`

2. **Vérifier que les styles du header utilisent `var(--font-family-sans)`** :
   - Dans les DevTools, inspecter un élément du header
   - Vérifier dans l'onglet "Styles" que `font-family: var(--font-family-sans);` est présent

## Commandes utiles dans la console

```javascript
// Vérifier toutes les fonts appliquées sur les éléments du header
document.querySelectorAll('.public-header *').forEach(el => {
  const style = window.getComputedStyle(el);
  if (style.fontFamily) {
    console.log(el.className, ':', style.fontFamily);
  }
});

// Vérifier les variables CSS
const root = getComputedStyle(document.documentElement);
console.log('--font-family-sans:', root.getPropertyValue('--font-family-sans'));
console.log('--font-family-serif:', root.getPropertyValue('--font-family-serif'));
```

## Résultat attendu

Quand tout fonctionne correctement :

- **Header public** : `font-family: "Neue Machina Inktrap", sans-serif`
- **Dashboard** : `font-family: "Inter", "Helvetica Neue", Arial, sans-serif`
- **Titres publics** : `font-family: "Ogg Text", serif`
- **Titres dashboard** : `font-family: "EB Garamond", "Playfair Display", "Times New Roman", serif`

