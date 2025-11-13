import Link from "next/link"

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
                <Link href={`/chat?prefill=${encodeURIComponent(ex)}`} className="public-themes-card__link">
                  {ex}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}


