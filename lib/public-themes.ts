export type PublicThemeStat = {
  label: string
  value: string
}

export type PublicTheme = {
  slug: string
  title: string
  subtitle?: string
  description?: string
  excerpt?: string
  tag?: string
  icon?: string
  stats?: PublicThemeStat[]
  prompts?: string[]
  display_order: number
  is_active: boolean
}

type ThemeListResponse = {
  results?: PublicTheme[]
  themes?: PublicTheme[]
}

const THEMES_ENDPOINT = "/api/dakkom/api/themes/"

async function fetchJson<T>(path: string): Promise<T | null> {
  // Utiliser une URL relative - Next.js résout automatiquement l'URL de base en contexte serveur
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000"
  const url = path.startsWith("http") ? path : `${baseUrl}${path}`
  const res = await fetch(url, {
    cache: "no-store",
  })
  if (!res.ok) {
    return null
  }
  try {
    return (await res.json()) as T
  } catch {
    return null
  }
}

export async function fetchPublicThemes(): Promise<PublicTheme[]> {
  const data = await fetchJson<ThemeListResponse | PublicTheme[]>(`${THEMES_ENDPOINT}?include_inactive=false`)
  if (!data) return []
  if (Array.isArray(data)) {
    return data
  }
  if (data.results) {
    return data.results
  }
  if (data.themes) {
    return data.themes
  }
  return []
}

export async function fetchPublicTheme(slug: string): Promise<PublicTheme | null> {
  if (!slug) return null
  const data = await fetchJson<PublicTheme | { theme?: PublicTheme }>(`${THEMES_ENDPOINT}${slug}/`)
  if (!data) return null
  if ("slug" in data) {
    return data
  }
  return data.theme ?? null
}

