import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { LanguageProvider } from "@/lib/language-context"
import { Toaster } from "@/components/ui/toaster"
import { GlobalErrorHandler } from "@/components/error/global-error-handler"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
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
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`font-sans antialiased`}>
        <LanguageProvider>
          <GlobalErrorHandler />
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  )
}
