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
  sections?: Array<{
    id: string
    title: Record<Language, string>
    paragraphs: Record<Language, string[]>
    image?: string
  }>
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
  sections?: Array<{
    id: string
    title: string
    paragraphs: string[]
    image?: string
  }>
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
    sections: [
      {
        id: "overview",
        title: { fr: "Aperçu", en: "Overview" },
        paragraphs: {
          fr: [
            "Le rapport entre technologies et organisation du travail évolue rapidement: automatisation, outillage IA, nouvelles compétences.",
            "Nous cartographions les controverses et présentons des cas d’usage vérifiables.",
          ],
          en: [
            "The relationship between technology and the organization of work evolves fast: automation, AI tooling, new skills.",
            "We map controversies and present verifiable use cases.",
          ],
        },
        image: "/placeholder.jpg",
      },
    ],
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
      {
        id: "soc-2",
        slug: "politique-publique-et-algorithmes",
        title: {
          fr: "Politiques publiques & algorithmes",
          en: "Public policy & algorithms",
        },
        excerpt: {
          fr: "Transparence, auditabilité et gouvernance des systèmes d’IA dans l’action publique.",
          en: "Transparency, auditability and governance of AI systems in public action.",
        },
        date: "2025-02-18",
        coverImage: "/placeholder.jpg",
      },
      {
        id: "soc-3",
        slug: "competences-de-demain",
        title: {
          fr: "Compétences de demain",
          en: "Skills for tomorrow",
        },
        excerpt: {
          fr: "Cartographie des compétences hybrides à l’ère des assistants IA.",
          en: "Mapping hybrid skills in the age of AI assistants.",
        },
        date: "2025-02-25",
        coverImage: "/placeholder.jpg",
      },
      {
        id: "soc-4",
        slug: "ethique-de-la-donnees",
        title: {
          fr: "Éthique de la donnée au quotidien",
          en: "Everyday data ethics",
        },
        excerpt: {
          fr: "Pratiques concrètes pour concilier innovation et respect des personnes.",
          en: "Concrete practices to reconcile innovation with respect for people.",
        },
        date: "2025-03-03",
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
    sections: [
      {
        id: "overview",
        title: { fr: "Aperçu", en: "Overview" },
        paragraphs: {
          fr: [
            "Les villes se transforment sous la pression climatique, énergétique et sociale.",
            "Ce dossier explore des trajectoires concrètes: mobilités, matériaux, production locale.",
          ],
          en: [
            "Cities are transforming under climate, energy and social pressures.",
            "This feature explores concrete trajectories: mobility, materials, local production.",
          ],
        },
        image: "/placeholder.jpg",
      },
    ],
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
      {
        id: "city-2",
        slug: "materiaux-circulaires-urbains",
        title: {
          fr: "Matériaux circulaires urbains",
          en: "Urban circular materials",
        },
        excerpt: {
          fr: "Réemploi, bio‑matériaux et circuits courts pour l’architecture.",
          en: "Reuse, biomaterials and short supply chains for architecture.",
        },
        date: "2025-01-28",
        coverImage: "/placeholder.jpg",
      },
      {
        id: "city-3",
        slug: "mobilites-sobres",
        title: {
          fr: "Mobilités sobres et inclusives",
          en: "Low‑impact inclusive mobility",
        },
        excerpt: {
          fr: "Concilier accessibilité, sécurité et réduction de l’empreinte.",
          en: "Reconciling accessibility, safety and footprint reduction.",
        },
        date: "2025-02-07",
        coverImage: "/placeholder.jpg",
      },
      {
        id: "city-4",
        slug: "nature-technologique",
        title: {
          fr: "Nature technologique en ville",
          en: "Technological nature in cities",
        },
        excerpt: {
          fr: "Capteurs, végétalisation et écologies hybrides.",
          en: "Sensors, greening and hybrid ecologies.",
        },
        date: "2025-02-16",
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
    sections: [
      {
        id: "overview",
        title: { fr: "Aperçu", en: "Overview" },
        paragraphs: {
          fr: [
            "La fiction propose des hypothèses vivantes qui nourrissent la réflexion stratégique.",
            "Nous présentons des œuvres, des pratiques artistiques et des méthodes de design spéculatif.",
          ],
          en: [
            "Fiction offers living hypotheses that feed strategic thinking.",
            "We showcase works, artistic practices and speculative design methods.",
          ],
        },
        image: "/placeholder.jpg",
      },
    ],
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
      {
        id: "art-2",
        slug: "poetique-des-donnees",
        title: {
          fr: "Poétique des données",
          en: "Poetics of data",
        },
        excerpt: {
          fr: "Transformer des datasets en récits et images sensibles.",
          en: "Turning datasets into evocative stories and images.",
        },
        date: "2025-01-05",
        coverImage: "/placeholder.jpg",
      },
      {
        id: "art-3",
        slug: "fictions-politiques",
        title: {
          fr: "Fictions politiques",
          en: "Political fictions",
        },
        excerpt: {
          fr: "Explorer les institutions possibles par le récit.",
          en: "Exploring possible institutions through storytelling.",
        },
        date: "2025-01-22",
        coverImage: "/placeholder.jpg",
      },
      {
        id: "art-4",
        slug: "atelier-ia-creative",
        title: {
          fr: "Ateliers d’IA créative",
          en: "Creative AI workshops",
        },
        excerpt: {
          fr: "Pratiques pédagogiques pour imaginer collectivement.",
          en: "Pedagogical practices for collective imagination.",
        },
        date: "2025-02-02",
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
    sections: [
      {
        id: "overview",
        title: { fr: "Aperçu", en: "Overview" },
        paragraphs: {
          fr: [
            "Veille scientifique et technologique pour éclairer les usages et les limites.",
            "Une approche critique des promesses et des risques.",
          ],
          en: [
            "Scientific and technological watch to illuminate use cases and limits.",
            "A critical approach to promises and risks.",
          ],
        },
        image: "/placeholder.jpg",
      },
    ],
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
      {
        id: "sci-2",
        slug: "robotique-collaborative",
        title: {
          fr: "Robotique collaborative",
          en: "Collaborative robotics",
        },
        excerpt: {
          fr: "Cobots, sécurité et nouvelles chaînes de valeur.",
          en: "Cobots, safety and new value chains.",
        },
        date: "2025-03-08",
        coverImage: "/placeholder.jpg",
      },
      {
        id: "sci-3",
        slug: "biotech-et-societe",
        title: {
          fr: "Bio‑tech et société",
          en: "Bio‑tech and society",
        },
        excerpt: {
          fr: "Promesses médicales, bio‑sécurité et accès équitable.",
          en: "Medical promises, bio‑security and equitable access.",
        },
        date: "2025-03-15",
        coverImage: "/placeholder.jpg",
      },
      {
        id: "sci-4",
        slug: "energie-et-computation",
        title: {
          fr: "Énergie & computation",
          en: "Energy & computation",
        },
        excerpt: {
          fr: "Empreinte énergétique des modèles et innovations matérielles.",
          en: "Models’ energy footprint and hardware innovations.",
        },
        date: "2025-03-22",
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
    sections: [
      {
        id: "overview",
        title: { fr: "Aperçu", en: "Overview" },
        paragraphs: {
          fr: [
            "Une section expérimentale où l’IA commente, réécrit ou débat à partir des textes FLAASH.",
            "Nous documentons la méthode et les garde‑fous éthiques.",
          ],
          en: [
            "An experimental section where AI comments, rewrites or debates from FLAASH texts.",
            "We document the method and ethical guardrails.",
          ],
        },
        image: "/placeholder.jpg",
      },
    ],
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
      {
        id: "col-2",
        slug: "ia-coauteur",
        title: {
          fr: "Quand l’IA devient co‑auteur",
          en: "When AI becomes a co‑author",
        },
        excerpt: {
          fr: "Processus créatif, attribution et responsabilité.",
          en: "Creative process, attribution and responsibility.",
        },
        date: "2025-02-14",
        coverImage: "/placeholder.jpg",
      },
      {
        id: "col-3",
        slug: "experiences-guidees-par-ia",
        title: {
          fr: "Expériences guidées par IA",
          en: "AI‑guided experiences",
        },
        excerpt: {
          fr: "Prototypages d’atelier et méthodologies pédagogiques.",
          en: "Workshop prototyping and pedagogical methods.",
        },
        date: "2025-02-21",
        coverImage: "/placeholder.jpg",
      },
      {
        id: "col-4",
        slug: "debats-contradictoires",
        title: {
          fr: "Débats contradictoires IA",
          en: "Contradictory AI debates",
        },
        excerpt: {
          fr: "Comparer des positions opposées avec traçabilité des sources.",
          en: "Contrast opposite positions with source traceability.",
        },
        date: "2025-02-27",
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
    sections: rec.sections?.map((s) => ({
      id: s.id,
      title: s.title[lang],
      paragraphs: s.paragraphs[lang],
      image: s.image,
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


