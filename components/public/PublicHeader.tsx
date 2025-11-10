"use client"

import Link from "next/link"
import Image from "next/image"
import { trackEvent } from "@/lib/analytics"
import { usePathname } from "next/navigation"
import { LanguageSwitcher } from "@/components/public/LanguageSwitcher"
import { useLanguage } from "@/lib/language-context"
import { useEffect, useState } from "react"
import { NavLinkNeon } from "@/components/public/ui/NavLinkNeon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getThemes } from "@/lib/themes"

type NavItem = {
  href: string
  labelKey: string
  external?: boolean
}

const navItems: NavItem[] = [
  { href: "/", labelKey: "public.nav.home" },
  { href: "/about", labelKey: "public.nav.about" },
  { href: "/guide", labelKey: "public.nav.guide" },
  { href: "/abonnement", labelKey: "public.nav.subscription" },
]

export function PublicHeader() {
  const pathname = usePathname()
  const { t, language } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const themes = getThemes(language)
  const remainingNav = navItems.filter((i) => i.href !== "/")

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 4)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className={`public-header sticky top-0 z-[2000] isolate w-full border-b border-gray-100 transition-all pointer-events-auto ${
      isScrolled ? "bg-white/95 shadow-md" : "bg-white/80"
    }`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded focus:bg-black focus:px-3 focus:py-1 focus:text-white">
        Aller au contenu principal
      </a>
      <div className="mx-auto flex h-16 md:h-20 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight" aria-label="Accueil FLAASH">
          <Image
            src="/logo-clair.png"
            alt="FLAASH"
            width={420}
            height={110}
            className="h-9 w-auto md:h-10"
            priority
          />
        </Link>

        <nav className="relative z-[2100] hidden items-center gap-7 md:flex pointer-events-auto" aria-label="Navigation principale">
          {/* 1) Accueil en premier */}
          <NavLinkNeon href="/" label={t("public.nav.home")} active={pathname === "/"} />
          {/* 2) Thématiques en deuxième */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={
                  pathname?.startsWith("/themes")
                    ? "relative z-10 inline-flex h-9 items-center cursor-pointer pointer-events-auto rounded px-2 text-[15px] text-gray-900 after:pointer-events-none after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-gradient-to-r after:from-cyan-400 after:to-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
                    : "relative z-10 inline-flex h-9 items-center cursor-pointer pointer-events-auto rounded px-2 text-[15px] text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2"
                }
                aria-label={t("public.nav.themes")}
                onClick={() => trackEvent("nav_themes_open")}
              >
                {t("public.nav.themes")}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="z-[3000]">
              <DropdownMenuItem asChild>
                <Link href="/themes" onClick={() => trackEvent("nav_theme_select", { slug: "all" } as any)}>
                  {language === "fr" ? "Toutes les thématiques" : "All themes"}
                </Link>
              </DropdownMenuItem>
              {themes.map((th) => (
                <DropdownMenuItem key={th.id} asChild>
                  <Link href={`/themes/${th.slug}`} onClick={() => trackEvent("nav_theme_select", { slug: th.slug } as any)}>
                    <span className="mr-2 select-none">{th.icon}</span>
                    {th.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* 3) Le reste des entrées */}
          {remainingNav.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                className="relative z-10 inline-flex h-9 items-center cursor-pointer pointer-events-auto rounded px-2 text-[15px] text-gray-600 hover:text-gray-900"
                onClick={() => trackEvent("nav_boutique")}
              >
                {t(item.labelKey)}
              </a>
            ) : (
              <NavLinkNeon key={item.href} href={item.href} label={t(item.labelKey)} active={pathname === item.href} />
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link
            href="/chat"
            className="hidden md:inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-300/60 transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
            onClick={() => trackEvent("cta_chat_header")}
          >
            <span aria-hidden>🤖</span>
            <span>{t("public.navExtra.exploreAI")}</span>
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
            aria-label="Ouvrir le menu"
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="fixed right-0 top-16 z-[1100] w-[70vw] max-w-sm border-t border-gray-100 bg-white shadow-lg">
            <nav className="px-4 pb-4 pt-3" aria-label="Navigation mobile">
              <div className="mb-2 flex items-center justify-between gap-2">
                <Link
                  href="/chat"
                  className="inline-flex w-full justify-center gap-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-300/60 transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
                  onClick={() => {
                    trackEvent("cta_chat_header")
                    setMobileOpen(false)
                  }}
                >
                  <span aria-hidden>🤖</span>
                  <span>{t("public.navExtra.exploreAI")}</span>
                </Link>
                <button
                  type="button"
                  className="rounded-md p-2 text-gray-700 hover:bg-gray-100"
                  aria-label="Fermer le menu"
                  onClick={() => setMobileOpen(false)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              {/* 1) Accueil en premier */}
              <div className="mb-1">
                <Link
                  href="/"
                  className={`rounded-md px-2 py-2 text-base hover:bg-gray-50 ${pathname === "/" ? "text-gray-900" : "text-gray-800"}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {t("public.nav.home")}
                </Link>
              </div>
              <div className="mb-2 flex flex-col">
                <Link
                  href="/themes"
                  className={`rounded-md px-2 py-2 text-base hover:bg-gray-50 ${pathname?.startsWith("/themes") ? "text-gray-900" : "text-gray-800"}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {t("public.nav.themes")}
                </Link>
                {themes.map((th) => (
                  <Link
                    key={th.id}
                    href={`/themes/${th.slug}`}
                    className="rounded-md px-2 py-2 pl-6 text-[15px] text-gray-800 hover:bg-gray-50"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="mr-2 select-none">{th.icon}</span>
                    {th.title}
                  </Link>
                ))}
              </div>
              <div className="flex max-h-[60vh] flex-col gap-1 overflow-auto">
                {remainingNav.map((item) =>
                  item.external ? (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="rounded-md px-2 py-2 text-base text-gray-800 hover:bg-gray-50"
                      onClick={() => {
                        trackEvent("nav_boutique")
                        setMobileOpen(false)
                      }}
                    >
                      {t(item.labelKey)}
                    </a>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-md px-2 py-2 text-base hover:bg-gray-50 ${
                        pathname === item.href ? "text-gray-900" : "text-gray-800"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {t(item.labelKey)}
                    </Link>
                  ),
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}


