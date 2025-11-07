"use client"

import { useState } from "react"

export function QuickAsk({ defaultValue }: { defaultValue?: string }) {
  const [query, setQuery] = useState(defaultValue ?? "Quelles technologies vont changer nos villes ?")
  return (
    <form
      className="mt-3 flex flex-col gap-3 sm:flex-row"
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
        className="w-full flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
        placeholder="Posez une question..."
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
      >
        Interroger l’Agent IA
      </button>
    </form>
  )
}


