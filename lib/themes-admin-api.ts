import { apiFetch } from "@/lib/session-client"
import { handleError } from "@/lib/error-handler"

export interface ThemeStat {
  label: string
  value: string
}

export interface ThemePayload {
  title: string
  slug: string
  subtitle?: string
  description?: string
  excerpt?: string
  tag?: string
  icon?: string
  stats?: ThemeStat[]
  prompts?: string[]
  display_order: number
  is_active: boolean
}

export interface ThemeAdmin extends ThemePayload {
  updated_at?: string
  created_at?: string
}

type ThemeListResponse = {
  results?: ThemeAdmin[]
  themes?: ThemeAdmin[]
}

const THEMES_ENDPOINT = "/api/dakkom/api/themes/"

export async function listThemesAdmin(includeInactive = true): Promise<ThemeAdmin[]> {
  try {
    const query = includeInactive ? "?include_inactive=true" : ""
    const { data } = await apiFetch<ThemeListResponse | ThemeAdmin[]>(`${THEMES_ENDPOINT}${query}`)
    if (Array.isArray(data)) {
      return data
    }
    if (data?.results) {
      return data.results
    }
    if (data?.themes) {
      return data.themes
    }
    return []
  } catch (error) {
    throw handleError(error)
  }
}

export async function createThemeAdmin(payload: ThemePayload) {
  try {
    return await apiFetch(THEMES_ENDPOINT, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    throw handleError(error)
  }
}

export async function updateThemeAdmin(slug: string, payload: Partial<ThemePayload>) {
  try {
    return await apiFetch(`${THEMES_ENDPOINT}${slug}/`, {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    throw handleError(error)
  }
}

