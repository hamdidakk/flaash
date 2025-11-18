"use client"

import { ChatLink } from "@/components/public/ui/ChatLink"

export type Theme = { icon: string; title: string; prompts: string[] }

export function ThemeGrid({ themes }: { themes: Theme[] }) {
  return (
    <div className="public-themes-grid">
      {themes.map((theme) => (
        <div key={theme.title} className="public-themes-card">
          <div className="public-themes-card__title">
            <span className="mr-2 select-none">{theme.icon}</span>
            {theme.title}
          </div>
          <ul className="public-themes-card__list">
            {theme.prompts.map((ex) => (
              <li key={ex}>
                <ChatLink href={`/chat?prefill=${encodeURIComponent(ex)}`} className="public-themes-card__link">
                  {ex}
                </ChatLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}


