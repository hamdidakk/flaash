import { Language } from "@/lib/i18n"

export type ThemeRecord = {
  id: string
  slug: string
  icon: string
  title: Record<Language, string>
  short: Record<Language, string>
  description: Record<Language, string>
  colorClass?: string
  coverImage?: string
  examples: Record<Language, string[]>
  posts: Array<{
    id: string
    slug: string
    title: Record<Language, string>
    excerpt: Record<Language, string>
    date: string
    coverImage?: string
  }>
}

export type LocalizedTheme = {
  id: string
  slug: string
  icon: string
  title: string
  short: string
  description: string
  colorClass?: string
  coverImage?: string
  examples: string[]
  posts: Array<{
    id: string
    slug: string
    title: string
    excerpt: string
    date: string
    coverImage?: string
  }>
}

const THEMES: ThemeRecord[] = [
  {
    id: "society",
    slug: "futur-societe",
    icon: "🌐",
    title: {
      fr: "Futur & Société",
      en: "Future & Society",
    },
    short: {
      fr: "Modes de vie, politique, travail, éthique de l’IA.",
      en: "Lifestyles, politics, work, AI ethics.",
    },
    description: {
      fr: "Articles sur l’évolution des modes de vie, les politiques publiques, le travail et l’éthique de l’IA. Une lecture transversale des mutations sociales.",
      en: "Articles about evolving lifestyles, public policy, work and AI ethics. A cross‑reading of social transformations.",
    },
    colorClass: "from-blue-50 to-purple-50",
    coverImage: "/placeholder.jpg",
    examples: {
      fr: [
        "Comment l’IA transforme-t-elle le travail aujourd’hui ?",
        "Peut-on concilier éthique et IA générative ?",
      ],
      en: [
        "How is AI transforming today’s work?",
        "Can we reconcile ethics and generative AI?",
      ],
    },
    posts: [
      {
        id: "soc-1",
        slug: "travail-et-ia-ethique",
        title: {
          fr: "Travail & IA: questions d’éthique",
          en: "Work & AI: ethical questions",
        },
        excerpt: {
          fr: "Un panorama des controverses autour de l’automatisation et de la responsabilité.",
          en: "A survey of controversies about automation and responsibility.",
        },
        date: "2025-02-10",
        coverImage: "/placeholder.jpg",
      },
    ],
  },
  {
    id: "cities-ecology",
    slug: "villes-ecologie",
    icon: "🏙️",
    title: {
      fr: "Villes & Écologie",
      en: "Cities & Ecology",
    },
    short: {
      fr: "Villes durables, urbanisme futuriste, nature technologique.",
      en: "Sustainable cities, future urbanism, technological nature.",
    },
    description: {
      fr: "Dossiers sur les villes durables, l’urbanisme futuriste et les agendas écologiques. Concilier infrastructures et vivants.",
      en: "Features on sustainable cities, future urbanism and ecological agendas. Reconciling infrastructures and the living.",
    },
    colorClass: "from-green-50 to-emerald-50",
    coverImage: "/placeholder.jpg",
    examples: {
      fr: [
        "Quelles technologies vont changer nos villes ?",
        "À quoi ressemble une ville bas‑carbone en 2035 ?",
      ],
      en: [
        "Which technologies will reshape our cities?",
        "What does a low‑carbon city look like in 2035?",
      ],
    },
    posts: [
      {
        id: "city-1",
        slug: "ville-bas-carbone-2035",
        title: {
          fr: "Ville bas‑carbone: scénarios 2035",
          en: "Low‑carbon city: 2035 scenarios",
        },
        excerpt: {
          fr: "Prospective sur les choix techniques et sociaux pour décarboner la ville.",
          en: "Foresight on technical and social choices to decarbonize the city.",
        },
        date: "2025-01-15",
        coverImage: "/placeholder.jpg",
      },
    ],
  },
  {
    id: "art-fiction",
    slug: "art-fiction",
    icon: "🎭",
    title: {
      fr: "Art & Fiction",
      en: "Art & Fiction",
    },
    short: {
      fr: "Créations visuelles IA, récits spéculatifs, design expérimental.",
      en: "AI visual works, speculative fiction, experimental design.",
    },
    description: {
      fr: "Créations IA, récits, poésie et design spéculatif pour penser autrement les futurs.",
      en: "AI creations, stories, poetry and speculative design to rethink futures.",
    },
    colorClass: "from-pink-50 to-fuchsia-50",
    coverImage: "/placeholder.jpg",
    examples: {
      fr: [
        "Quels romans parlent des futurs de la société ?",
        "Comment l’imaginaire influence l’innovation ?",
      ],
      en: [
        "Which novels explore society’s futures?",
        "How does imagination influence innovation?",
      ],
    },
    posts: [
      {
        id: "art-1",
        slug: "design-speculatif-intro",
        title: {
          fr: "Introduction au design spéculatif",
          en: "Introduction to speculative design",
        },
        excerpt: {
          fr: "Méthodes et exemples pour explorer des futurs alternatifs.",
          en: "Methods and examples to explore alternative futures.",
        },
        date: "2024-12-20",
        coverImage: "/placeholder.jpg",
      },
    ],
  },
  {
    id: "science-tech",
    slug: "science-technologie",
    icon: "⚙️",
    title: {
      fr: "Science & Technologie",
      en: "Science & Technology",
    },
    short: {
      fr: "Vulgarisation, veille scientifique, IA éthique, robotique, biotech.",
      en: "Popular science, scientific watch, ethical AI, robotics, biotech.",
    },
    description: {
      fr: "Articles de vulgarisation, veille scientifique, enjeux d’IA, robotique et bio‑tech.",
      en: "Popular science, scientific watch, AI issues, robotics and biotech.",
    },
    colorClass: "from-indigo-50 to-blue-50",
    coverImage: "/placeholder.jpg",
    examples: {
      fr: [
        "Quelles découvertes IA ont marqué 2024‑2025 ?",
        "Quels risques et promesses de la bio‑ingénierie ?",
      ],
      en: [
        "Which AI discoveries stood out in 2024‑2025?",
        "What are the risks and promises of bio‑engineering?",
      ],
    },
    posts: [
      {
        id: "sci-1",
        slug: "etat-art-ia-2025",
        title: {
          fr: "État de l’art IA 2025",
          en: "AI State of the Art 2025",
        },
        excerpt: {
          fr: "Synthèse des percées récentes et de leurs implications.",
          en: "Summary of recent breakthroughs and their implications.",
        },
        date: "2025-03-01",
        coverImage: "/placeholder.jpg",
      },
    ],
  },
  {
    id: "ia-columns",
    slug: "chroniques-ia",
    icon: "🧠",
    title: {
      fr: "Chroniques IA",
      en: "AI Chronicles",
    },
    short: {
      fr: "Quand l’IA écrit, commente ou débat des articles de la revue.",
      en: "Where the AI writes, comments or debates the magazine’s articles.",
    },
    description: {
      fr: "Une section expérimentale où l’IA prend la plume ou débat avec nos textes.",
      en: "An experimental section where AI writes or debates with our texts.",
    },
    colorClass: "from-slate-50 to-gray-50",
    coverImage: "/placeholder.jpg",
    examples: {
      fr: [
        "L’IA peut‑elle enrichir un débat public ?",
        "Quelles limites à l’IA éditoriale ?",
      ],
      en: [
        "Can AI enrich public debate?",
        "What are the limits of editorial AI?",
      ],
    },
    posts: [
      {
        id: "col-1",
        slug: "ia-debat-editorial",
        title: {
          fr: "Débat: IA éditoriale en pratique",
          en: "Debate: editorial AI in practice",
        },
        excerpt: {
          fr: "Débat guidé par IA à partir d’articles FLAASH.",
          en: "AI‑guided debate based on FLAASH articles.",
        },
        date: "2025-02-05",
        coverImage: "/placeholder.jpg",
      },
    ],
  },
]

function mapTheme(rec: ThemeRecord, lang: Language): LocalizedTheme {
  return {
    id: rec.id,
    slug: rec.slug,
    icon: rec.icon,
    title: rec.title[lang],
    short: rec.short[lang],
    description: rec.description[lang],
    colorClass: rec.colorClass,
    coverImage: rec.coverImage,
    examples: rec.examples[lang],
    posts: rec.posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title[lang],
      excerpt: p.excerpt[lang],
      date: p.date,
      coverImage: p.coverImage,
    })),
  }
}

export function getThemes(lang: Language): LocalizedTheme[] {
  return THEMES.map((t) => mapTheme(t, lang))
}

export function getThemeBySlug(slug: string, lang: Language): LocalizedTheme | undefined {
  const rec = THEMES.find((t) => t.slug === slug)
  return rec ? mapTheme(rec, lang) : undefined
}

export function getAllThemeSlugs(): string[] {
  return THEMES.map((t) => t.slug)
}


