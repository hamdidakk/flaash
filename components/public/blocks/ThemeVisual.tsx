type ThemeVisualVariant = "hero" | "card"

type ThemeVisualProps = {
  slug: string
  icon: string
  title: string
  subtitle?: string
  tag?: string
  variant?: ThemeVisualVariant
}

type ThemePalette = {
  gradientHero: string
  gradientCard: string
  border: string
  bubble: string
  bubbleAlt: string
  tag: string
}

const themePalette: Record<string, ThemePalette> = {
  "futur-societe": {
    gradientHero: "from-indigo-500/40 via-purple-500/15 to-transparent",
    gradientCard: "from-indigo-500/25 via-purple-500/10 to-transparent",
    border: "border-indigo-100",
    bubble: "bg-indigo-400/30",
    bubbleAlt: "bg-purple-400/25",
    tag: "bg-indigo-500/15 text-indigo-700",
  },
  "villes-ecologie": {
    gradientHero: "from-emerald-500/40 via-teal-400/15 to-transparent",
    gradientCard: "from-emerald-500/25 via-teal-400/10 to-transparent",
    border: "border-emerald-100",
    bubble: "bg-emerald-400/30",
    bubbleAlt: "bg-teal-300/25",
    tag: "bg-emerald-500/15 text-emerald-700",
  },
  "art-fiction": {
    gradientHero: "from-pink-500/40 via-fuchsia-400/15 to-transparent",
    gradientCard: "from-pink-500/25 via-fuchsia-400/10 to-transparent",
    border: "border-pink-100",
    bubble: "bg-pink-400/30",
    bubbleAlt: "bg-fuchsia-400/25",
    tag: "bg-pink-500/15 text-pink-700",
  },
  "science-technologie": {
    gradientHero: "from-blue-500/40 via-sky-400/15 to-transparent",
    gradientCard: "from-blue-500/25 via-sky-400/10 to-transparent",
    border: "border-blue-100",
    bubble: "bg-blue-400/30",
    bubbleAlt: "bg-sky-400/25",
    tag: "bg-blue-500/15 text-blue-700",
  },
  "chroniques-ia": {
    gradientHero: "from-slate-500/35 via-indigo-400/15 to-transparent",
    gradientCard: "from-slate-500/20 via-indigo-400/10 to-transparent",
    border: "border-slate-200",
    bubble: "bg-slate-500/25",
    bubbleAlt: "bg-indigo-400/20",
    tag: "bg-slate-500/15 text-slate-700",
  },
  default: {
    gradientHero: "from-gray-500/30 via-gray-300/15 to-transparent",
    gradientCard: "from-gray-500/20 via-gray-300/10 to-transparent",
    border: "border-gray-200",
    bubble: "bg-gray-400/25",
    bubbleAlt: "bg-gray-300/25",
    tag: "bg-gray-500/15 text-gray-700",
  },
}

export function ThemeVisual({ slug, icon, title, subtitle, tag, variant = "card" }: ThemeVisualProps) {
  const palette = themePalette[slug] ?? themePalette.default

  if (variant === "hero") {
    return (
      <div className={`relative overflow-hidden rounded-2xl border ${palette.border} bg-white`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${palette.gradientHero}`} aria-hidden />
        <div className={`absolute -left-16 top-6 h-32 w-32 rounded-full ${palette.bubble} blur-3xl`} aria-hidden />
        <div className={`absolute -right-12 bottom-0 h-28 w-28 rounded-full ${palette.bubbleAlt} blur-3xl`} aria-hidden />
        <div className="relative flex flex-col items-center px-6 py-10 text-center">
          <span className="text-6xl drop-shadow-sm">{icon}</span>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle ? <p className="mt-2 max-w-sm text-sm text-gray-600">{subtitle}</p> : null}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative mb-3 aspect-[16/9] overflow-hidden rounded-lg border ${palette.border} bg-white/95 shadow-sm`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${palette.gradientCard}`} aria-hidden />
      <div className={`absolute -left-10 bottom-0 h-24 w-24 rounded-full ${palette.bubble} blur-3xl`} aria-hidden />
      <div className={`absolute right-0 top-0 h-20 w-20 rounded-full ${palette.bubbleAlt} blur-3xl`} aria-hidden />
      <div className="relative flex h-full flex-col justify-between px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-3xl drop-shadow">{icon}</span>
          {tag ? <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${palette.tag}`}>{tag}</span> : null}
        </div>
        {subtitle ? <p className="text-xs text-gray-600">{subtitle}</p> : null}
      </div>
    </div>
  )
}


