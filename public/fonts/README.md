# Fonts publiques

Ce dossier contient les fichiers de fonts pour le site public.

## Fonts requises

### Ogg Text (Serif)
- `OggText-Regular.woff2` (ou `.woff`)
- `OggText-Medium.woff2` (ou `.woff`)
- `OggText-Bold.woff2` (ou `.woff`)

### Neue Machina Inktrap (Sans-serif)
- `NeueMachinaInktrap-Regular.woff2` (ou `.woff`)
- `NeueMachinaInktrap-Medium.woff2` (ou `.woff`)
- `NeueMachinaInktrap-Bold.woff2` (ou `.woff`)

## Format

Les fonts doivent être au format `.woff2` (recommandé) ou `.woff`.

## Installation

1. **Ajouter les fichiers de fonts** dans ce dossier (`public/fonts/`)

2. **Décommenter les @font-face** dans `app/globals.css` :
   - Ouvrir `app/globals.css`
   - Chercher la section `/* Fonts publiques - Ogg Text et Neue Machina Inktrap */`
   - Décommenter tous les blocs `@font-face` (enlever `/*` au début et `*/` à la fin)

3. **Vérifier que les fonts sont chargées** :
   - Ouvrir les DevTools (F12)
   - Aller dans l'onglet "Network"
   - Filtrer par "Font"
   - Recharger la page
   - Vérifier que les fichiers de fonts sont chargés (statut 200)

## Application

Ces fonts sont appliquées automatiquement sur toutes les pages publiques via la classe CSS `.public-site`.

Le dashboard utilise les fonts Inter et EB Garamond (définies dans `app/layout.tsx`).

## Note

Les `@font-face` sont actuellement commentés dans `app/globals.css` pour éviter les erreurs 404 tant que les fichiers ne sont pas ajoutés. Une fois les fichiers ajoutés, décommenter les `@font-face` pour activer les fonts.

## Solution temporaire (Google Fonts)

En attendant d'obtenir les fonts originales, tu peux utiliser des alternatives gratuites similaires :

1. **Ajouter dans `app/layout.tsx`** (après les imports existants) :
```typescript
import { Playfair_Display, Space_Grotesk } from "next/font/google"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-playfair",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
})
```

2. **Modifier les variables CSS dans `app/globals.css`** :
```css
--font-family-serif: var(--font-playfair, "Playfair Display"), serif;
--font-family-sans: var(--font-space-grotesk, "Space Grotesk"), sans-serif;
```

3. **Ajouter les variables dans le className du `<html>` dans `app/layout.tsx`** :
```typescript
<html className={`${inter.variable} ${ebGaramond.variable} ${playfairDisplay.variable} ${spaceGrotesk.variable}`}>
```

Voir `docs/fonts-sources.md` pour plus d'informations sur où trouver les fonts originales.

