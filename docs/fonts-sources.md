# Sources pour télécharger les fonts Ogg Text et Neue Machina Inktrap

## Ogg Text (Serif)

**Ogg Text** est une police serif moderne créée par **Production Type**.

### Où la trouver :

1. **Production Type** (source officielle)
   - Site : https://www.productiontype.com/
   - Rechercher "Ogg Text" dans leur catalogue
   - Format : Commercial (licence payante)
   - Formats disponibles : OTF, TTF, WOFF, WOFF2

2. **Adobe Fonts** (si vous avez un abonnement Adobe)
   - Site : https://fonts.adobe.com/
   - Rechercher "Ogg Text"
   - Disponible avec l'abonnement Adobe Creative Cloud

3. **MyFonts / Fonts.com**
   - Site : https://www.myfonts.com/
   - Rechercher "Ogg Text"
   - Achat à l'unité possible

### Alternatives gratuites similaires :

- **Playfair Display** (Google Fonts) - Gratuit
- **Cormorant Garamond** (Google Fonts) - Gratuit
- **Lora** (Google Fonts) - Gratuit

## Neue Machina Inktrap (Sans-serif)

**Neue Machina Inktrap** est une variante de la famille **Neue Machina** avec des caractéristiques "inktrap".

### Où la trouver :

1. **Production Type** (source officielle)
   - Site : https://www.productiontype.com/
   - Rechercher "Neue Machina" dans leur catalogue
   - Format : Commercial (licence payante)
   - Formats disponibles : OTF, TTF, WOFF, WOFF2

2. **Adobe Fonts** (si vous avez un abonnement Adobe)
   - Site : https://fonts.adobe.com/
   - Rechercher "Neue Machina"
   - Disponible avec l'abonnement Adobe Creative Cloud

3. **MyFonts / Fonts.com**
   - Site : https://www.myfonts.com/
   - Rechercher "Neue Machina"
   - Achat à l'unité possible

### Alternatives gratuites similaires :

- **Space Grotesk** (Google Fonts) - Gratuit, style géométrique moderne
- **Inter** (Google Fonts) - Gratuit, déjà utilisé dans le dashboard
- **Poppins** (Google Fonts) - Gratuit, style géométrique
- **DM Sans** (Google Fonts) - Gratuit, style moderne

## Conversion en WOFF2

Si vous obtenez les fonts en format OTF ou TTF, vous devrez les convertir en WOFF2 :

### Outils de conversion :

1. **Online Font Converter**
   - https://cloudconvert.com/ttf-to-woff2
   - https://convertio.co/ttf-woff2/

2. **Outils en ligne de commande** :
   - `woff2` (outil officiel de Google)
   - Installation : `npm install -g woff2`
   - Usage : `woff2_compress font.ttf`

3. **Font Squirrel Webfont Generator**
   - https://www.fontsquirrel.com/tools/webfont-generator
   - Gratuit, génère WOFF, WOFF2, et les CSS

## Utilisation temporaire avec des alternatives

En attendant d'obtenir les fonts originales, tu peux utiliser des alternatives gratuites :

### Option 1 : Utiliser des fonts Google Fonts similaires

Modifier `app/globals.css` pour utiliser des fonts Google Fonts :

```css
/* Alternative temporaire avec Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap');

:root {
  --font-family-serif: "Playfair Display", serif;
  --font-family-sans: "Space Grotesk", sans-serif;
}
```

### Option 2 : Utiliser les fonts déjà chargées (Inter)

Modifier temporairement les variables CSS pour utiliser Inter (déjà chargé) :

```css
:root {
  --font-family-serif: var(--font-eb-garamond, "EB Garamond"), serif;
  --font-family-sans: var(--font-inter, "Inter"), sans-serif;
}
```

## Recommandation

1. **Court terme** : Utiliser des alternatives Google Fonts (Playfair Display + Space Grotesk)
2. **Long terme** : Acheter les fonts originales auprès de Production Type ou utiliser Adobe Fonts

## Liens utiles

- **Production Type** : https://www.productiontype.com/
- **Adobe Fonts** : https://fonts.adobe.com/
- **Google Fonts** : https://fonts.google.com/
- **Font Squirrel** : https://www.fontsquirrel.com/
- **MyFonts** : https://www.myfonts.com/

## Note importante

Assure-toi de vérifier la licence d'utilisation des fonts avant de les utiliser dans un projet commercial. Les fonts commerciales nécessitent généralement une licence payante pour une utilisation commerciale.

