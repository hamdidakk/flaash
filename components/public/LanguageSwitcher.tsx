"use client"

import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"

import { GlobeIcon } from "@/components/public/icons/GlobeIcon"

interface LanguageSwitcherProps {
  variant?: "inline" | "menu"
}

export function LanguageSwitcher({ variant = "inline" }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage()
  const router = useRouter()

  const handleSwitch = (lang: "fr" | "en") => {
    if (lang === language) return
    setLanguage(lang)
    setTimeout(() => router.refresh(), 0)
  }

  if (variant === "menu") {
    return (
      <div className="public-lang-switcher public-lang-switcher--menu" aria-label="Language selector">
        <button
          type="button"
          className="public-lang-switcher__trigger"
          aria-haspopup="listbox"
          aria-expanded="false"
          onClick={() => handleSwitch(language === "fr" ? "en" : "fr")}
        >
          <GlobeIcon className="mr-1 size-3.5" />
          <span>{language === "fr" ? "FR" : "EN"}</span>
        </button>
      </div>
    )
  }

  return (
    <div className="public-lang-switcher" aria-label="Language selector">
      <label htmlFor="public-lang-select" className="sr-only">
        Sélectionner la langue
      </label>
      <select
        id="public-lang-select"
        value={language}
        onChange={(event) => handleSwitch(event.target.value as "fr" | "en")}
        className="public-lang-switcher__select"
      >
        <option value="fr">FR</option>
        <option value="en">EN</option>
      </select>
    </div>
  )
}


