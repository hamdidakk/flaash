"use client"

import { useState } from "react"

export function QuickAsk({ defaultValue, placeholder, ctaLabel }: { defaultValue?: string; placeholder?: string; ctaLabel?: string }) {
  const [query, setQuery] = useState(defaultValue ?? "")
  return (
    <form
      className="public-quickask"
      onSubmit={(e) => {
        e.preventDefault()
        if (typeof window !== "undefined") {
          window.location.href = `/chat?prefill=${encodeURIComponent(query)}`
        }
      }}
    >
      <label htmlFor="quick-ask" className="sr-only">Votre question</label>
      <input
        id="quick-ask"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="public-quickask__input"
        placeholder={placeholder ?? "Posez une question..."}
      />
      <button
        type="submit"
        className="public-quickask__button"
      >
        {ctaLabel ?? "Interroger l’Agent IA"}
      </button>
    </form>
  )
}


