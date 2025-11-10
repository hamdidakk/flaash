"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, type Language } from "./i18n"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cookieMatch = document.cookie.match(/(?:^|;\s*)language=(en|fr)/)
      const stored = localStorage.getItem("language") as Language | null
      const initial = (cookieMatch?.[1] as Language | undefined) ?? stored ?? "fr"
      const normalized = initial === "en" ? "en" : "fr"
      setLanguageState(normalized)
      localStorage.setItem("language", normalized)
      document.cookie = `language=${normalized}; path=/; max-age=31536000`
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang)
      document.cookie = `language=${lang}; path=/; max-age=31536000`
    }
  }

  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = translations[language]

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

export { LanguageContext }
