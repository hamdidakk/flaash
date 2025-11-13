"use client"

import { useId } from "react"

import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"

type Flag = "fr" | "gb"

function FlagIcon({ country }: { country: Flag }) {
  const clipPathId = useId()

  if (country === "fr") {
    return (
      <svg
        viewBox="0 0 3 2"
        className="public-lang-switcher__flag"
        aria-hidden
        focusable="false"
        role="img"
      >
        <rect width="1" height="2" fill="#0055A4" />
        <rect width="1" height="2" fill="#FFFFFF" x="1" />
        <rect width="1" height="2" fill="#EF4135" x="2" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 60 30"
      className="public-lang-switcher__flag"
      aria-hidden
      focusable="false"
      role="img"
    >
      <clipPath id={clipPathId}>
        <path d="M0 0h60v30H0z" />
      </clipPath>
      <g clipPath={`url(#${clipPathId})`}>
        <path d="M0 0h60v30H0z" fill="#012169" />
        <path d="M0 0l60 30m0-30L0 30" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M0 0l60 30m0-30L0 30" stroke="#C8102E" strokeWidth="3.6" />
        <path d="M30 0v30M0 15h60" stroke="#FFFFFF" strokeWidth="10" />
        <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  )
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const router = useRouter()

  const handleSwitch = (lang: "fr" | "en") => {
    if (lang === language) return
    setLanguage(lang)
    setTimeout(() => router.refresh(), 0)
  }

  return (
    <div className="public-lang-switcher" aria-label="Language selector">
      <button
        type="button"
        onClick={() => handleSwitch("fr")}
        className={`public-lang-switcher__button ${language === "fr" ? "public-lang-switcher__button--active" : ""}`}
        aria-pressed={language === "fr"}
      >
        <FlagIcon country="fr" />
        FR
      </button>
      <button
        type="button"
        onClick={() => handleSwitch("en")}
        className={`public-lang-switcher__button ${language === "en" ? "public-lang-switcher__button--active" : ""}`}
        aria-pressed={language === "en"}
      >
        <FlagIcon country="gb" />
        EN
      </button>
    </div>
  )
}


