import type React from "react"
import type { Metadata } from "next"
import { Inter, EB_Garamond, Playfair_Display, Space_Grotesk } from "next/font/google"
import { LanguageProvider } from "@/lib/language-context"
import { Toaster } from "@/components/ui/toaster"
import { GlobalErrorHandler } from "@/components/error/global-error-handler"
import "./globals.css"

// Fonts pour le dashboard
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-eb-garamond",
})

// Fonts pour le site public (alternatives à Ogg Text et Neue Machina Inktrap)
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
  variable: "--font-playfair",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
})
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flaash.fr"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FLAASH — Revue & Agent IA public",
    template: "%s — FLAASH",
  },
  description: "Flaash explore les futurs possibles via une revue éditoriale et un Agent IA public.",
  generator: "flaash.fr",
  openGraph: {
    title: "FLAASH — Revue & Agent IA public",
    description: "Explorez les futurs possibles avec la revue FLAASH et son Agent IA.",
    type: "website",
    url: "https://flaash.fr",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ebGaramond.variable} ${playfairDisplay.variable} ${spaceGrotesk.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="public-site font-sans antialiased">
        <LanguageProvider>
          <GlobalErrorHandler />
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  )
}
