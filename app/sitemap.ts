import { getAllThemeSlugs } from "@/lib/themes"

export default async function sitemap() {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://flaash.fr")

  const now = new Date().toISOString()

  const staticPages = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/themes`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/guide`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/abonnement`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/chat`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/legal`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ]

  const themePages = getAllThemeSlugs().map((slug) => ({
    url: `${base}/themes/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticPages, ...themePages]
}


