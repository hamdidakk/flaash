import type React from "react"
import type { Metadata } from "next"
import { Inter, EB_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { LanguageProvider } from "@/lib/language-context"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

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
    <html lang="en" className={`${inter.variable} ${ebGaramond.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
