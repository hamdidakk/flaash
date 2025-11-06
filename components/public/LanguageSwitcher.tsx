"use client"

import { useLanguage } from "@/lib/language-context"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-1" aria-label="Language selector">
      <button
        type="button"
        onClick={() => setLanguage("fr")}
        className={`inline-flex items-center rounded px-2 py-1 text-sm ${
          language === "fr" ? "bg-gray-200" : "hover:bg-gray-100"
        }`}
        aria-pressed={language === "fr"}
      >
        <span className="mr-1" aria-hidden>
          🇫🇷
        </span>
        FR
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`inline-flex items-center rounded px-2 py-1 text-sm ${
          language === "en" ? "bg-gray-200" : "hover:bg-gray-100"
        }`}
        aria-pressed={language === "en"}
      >
        <span className="mr-1" aria-hidden>
          🇬🇧
        </span>
        EN
      </button>
    </div>
  )
}


