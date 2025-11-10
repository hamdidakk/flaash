"use client"

import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const router = useRouter()

  const handleSwitch = (lang: "fr" | "en") => {
    if (lang === language) return
    setLanguage(lang)
    setTimeout(() => router.refresh(), 0)
  }

  return (
    <div className="flex items-center gap-2" aria-label="Language selector">
      <button
        type="button"
        onClick={() => handleSwitch("fr")}
        className={`inline-flex items-center rounded px-2.5 py-1.5 text-[15px] ${
          language === "fr" ? "bg-gray-200" : "hover:bg-gray-100"
        }`}
        aria-pressed={language === "fr"}
      >
        <span className="mr-1 text-base" aria-hidden>
          🇫🇷
        </span>
        FR
      </button>
      <button
        type="button"
        onClick={() => handleSwitch("en")}
        className={`inline-flex items-center rounded px-2.5 py-1.5 text-[15px] ${
          language === "en" ? "bg-gray-200" : "hover:bg-gray-100"
        }`}
        aria-pressed={language === "en"}
      >
        <span className="mr-1 text-base" aria-hidden>
          🇬🇧
        </span>
        EN
      </button>
    </div>
  )
}


