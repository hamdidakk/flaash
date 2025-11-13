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
      <div className={`public-theme-visual ${palette.border}`}>
        <div className={`public-theme-visual__gradient ${palette.gradientHero}`} aria-hidden />
        <div className={`public-theme-visual__bubble -left-16 top-6 h-32 w-32 ${palette.bubble}`} aria-hidden />
        <div className={`public-theme-visual__bubble -right-12 bottom-0 h-28 w-28 ${palette.bubbleAlt}`} aria-hidden />
        <div className="public-theme-visual__body">
          <span className="public-theme-visual__icon">{icon}</span>
          <h3 className="public-theme-visual__title">{title}</h3>
          {subtitle ? <p className="public-theme-visual__subtitle">{subtitle}</p> : null}
        </div>
      </div>
    )
  }

  return (
    <div className={`public-theme-card ${palette.border}`}>
      <div className={`public-theme-card__gradient ${palette.gradientCard}`} aria-hidden />
      <div className={`public-theme-card__bubble -left-10 bottom-0 h-24 w-24 ${palette.bubble}`} aria-hidden />
      <div className={`public-theme-card__bubble right-0 top-0 h-20 w-20 ${palette.bubbleAlt}`} aria-hidden />
      <div className="public-theme-card__body">
        <div className="public-theme-card__header">
          <span className="public-theme-card__icon">{icon}</span>
          {tag ? <span className={`public-theme-card__tag ${palette.tag}`}>{tag}</span> : null}
        </div>
        {subtitle ? <p className="public-theme-card__subtitle">{subtitle}</p> : null}
      </div>
    </div>
  )
}


