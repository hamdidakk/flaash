import Image from "next/image"
import Link from "next/link"
import { headers } from "next/headers"
import { getThemeBySlug, getThemes, getAllThemeSlugs } from "@/lib/themes"
import type { Language } from "@/lib/i18n"
import { PageSection } from "@/components/public/ui/PageSection"
import { SectionHeader } from "@/components/public/ui/SectionHeader"
import { SectionCard } from "@/components/public/ui/SectionCard"
import { HeroSplit } from "@/components/public/blocks/HeroSplit"
import { QuickAsk } from "@/components/public/blocks/QuickAsk"
import { notFound } from "next/navigation"

function detectLanguage(): Language {
  const h = headers()
  const al = h.get("accept-language") || ""
  return al.toLowerCase().startsWith("en") ? "en" : "fr"
}

export async function generateStaticParams() {
  return getAllThemeSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const language = detectLanguage()
  const theme = getThemeBySlug(params.slug, language)
  if (!theme) return {}
  const title = `${theme.title} | FLAASH`
  const description = theme.short
  return {
    title,
    description,
    alternates: { canonical: `/themes/${theme.slug}` },
    openGraph: {
      title,
      description,
      images: theme.coverImage ? [{ url: theme.coverImage }] : undefined,
      type: "article",
    },
  }
}

export default async function ThemeDetailPage({ params }: { params: { slug: string } }) {
  const language = detectLanguage()
  const theme = getThemeBySlug(params.slug, language)
  if (!theme) return notFound()

  const related = getThemes(language).filter((t) => t.slug !== theme.slug).slice(0, 3)

  return (
    <main id="main">
      <PageSection containerClassName="py-10">
        <HeroSplit
          heading={`${theme.icon} ${theme.title}`}
          subtitle={theme.description}
          containerClassName="py-6"
          right={
            <SectionCard variant="future" className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="text-5xl">{theme.icon}</div>
                <p className="mt-2 text-sm text-gray-600">{theme.short}</p>
                {theme.coverImage ? (
                  <div className="mt-4 overflow-hidden rounded-xl border">
                    <Image
                      src={theme.coverImage}
                      width={640}
                      height={360}
                      alt={theme.title}
                      className="h-auto w-full"
                    />
                  </div>
                ) : null}
              </div>
            </SectionCard>
          }
        />

        {theme.sections && theme.sections.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {theme.sections.map((sec) => (
              <SectionCard key={sec.id}>
                <h3 className="text-base font-semibold text-gray-900">{sec.title}</h3>
                <div className="mt-2 space-y-2 text-sm text-gray-700">
                  {sec.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
                {sec.image ? (
                  <div className="mt-3 overflow-hidden rounded-lg border">
                    <Image src={sec.image} alt={sec.title} width={640} height={360} className="h-auto w-full" />
                  </div>
                ) : null}
              </SectionCard>
            ))}
          </div>
        ) : null}

        <div className="mt-8">
          <SectionHeader
            title={language === "fr" ? "À la une" : "Featured"}
            subtitle={language === "fr" ? "Sélection d’articles de la thématique" : "Selection of articles in this theme"}
            icon="⭐"
          />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {theme.posts.map((p) => (
              <SectionCard key={p.id} className="flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{p.title}</h3>
                  <p className="mt-2 text-sm text-gray-700">{p.excerpt}</p>
                </div>
                <div className="mt-3">
                  <Link href={`/chat?prefill=${encodeURIComponent(p.title)}`} className="text-sm font-medium text-indigo-600 hover:underline">
                    {language === "fr" ? "Interroger l’IA à partir de cet article →" : "Ask the AI about this article →"}
                  </Link>
                </div>
              </SectionCard>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <SectionHeader
            title={language === "fr" ? "Posez une question" : "Ask a question"}
            subtitle={language === "fr" ? "Interrogez l’Agent IA sur cette thématique" : "Ask the AI Agent about this theme"}
            icon="🤖"
          />
          <QuickAsk
            defaultValue={theme.examples[0] || ""}
            placeholder={
              language === "fr"
                ? "Ex. : Quelles évolutions sociétales liées à l’IA ?"
                : "Ex.: What societal shifts are tied to AI?"
            }
            ctaLabel={language === "fr" ? "Interroger l’Agent IA" : "Talk to the AI"}
          />
        </div>

        <div className="mt-10">
          <SectionHeader
            title={language === "fr" ? "Thématiques liées" : "Related themes"}
            subtitle={language === "fr" ? "Explorez d’autres rubriques proches" : "Explore adjacent categories"}
            icon="🧭"
          />
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <SectionCard key={r.id}>
                <h4 className="text-sm font-semibold text-gray-900">
                  <span className="mr-2 select-none">{r.icon}</span>
                  {r.title}
                </h4>
                <p className="mt-2 text-sm text-gray-700">{r.short}</p>
                <div className="mt-3">
                  <Link href={`/themes/${r.slug}`} className="text-sm font-medium text-indigo-600 hover:underline">
                    {language === "fr" ? "Découvrir →" : "Explore →"}
                  </Link>
                </div>
              </SectionCard>
            ))}
          </div>
        </div>
      </PageSection>
    </main>
  )
}


