import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { LanguageProvider } from "@/lib/language-context"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
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
    <html lang="en">
      <body className={`font-sans antialiased`}>
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
