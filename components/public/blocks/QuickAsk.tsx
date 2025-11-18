"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSessionStore } from "@/store/session-store"

export function QuickAsk({ defaultValue, placeholder, ctaLabel }: { defaultValue?: string; placeholder?: string; ctaLabel?: string }) {
  const [query, setQuery] = useState(defaultValue ?? "")
  const router = useRouter()
  const { status } = useSessionStore()

  return (
    <form
      className="public-quickask"
      onSubmit={(e) => {
        e.preventDefault()
        const chatUrl = `/chat?prefill=${encodeURIComponent(query)}`
        if (status === "authenticated") {
          router.push(chatUrl)
        } else {
          router.push(`/login?redirect=${encodeURIComponent(chatUrl)}`)
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


