import Link from "next/link"

export type Theme = { icon: string; title: string; prompts: string[] }

export function ThemeGrid({ themes }: { themes: Theme[] }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
      {themes.map((theme) => (
        <div key={theme.title} className="group rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-md">
          <div className="text-sm font-semibold tracking-tight">
            <span className="mr-2 select-none">{theme.icon}</span>
            {theme.title}
          </div>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {theme.prompts.map((ex) => (
              <li key={ex}>
                <Link href={`/chat?prefill=${encodeURIComponent(ex)}`} className="hover:underline">
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


