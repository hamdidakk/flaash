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
    <header className={`public-header ${isScrolled ? "public-header--scrolled" : "public-header--top"}`}>
      <a href="#main" className="public-header__skip-link">
        Aller au contenu principal
      </a>
      <div className="public-header__inner">
        <Link href="/" className="public-header__logo-link" aria-label="Accueil FLAASH">
          <Image
            src="/logo-clair.png"
            alt="FLAASH"
            width={420}
            height={110}
            className="public-header__logo-image"
            priority
          />
        </Link>

        <nav className="public-header__nav" aria-label="Navigation principale">
          {/* 1) Accueil en premier */}
          <NavLinkNeon href="/" label={t("public.nav.home")} active={pathname === "/"} />
          {/* 2) Thématiques en deuxième */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`public-header__themes-trigger ${
                  pathname?.startsWith("/themes") ? "public-header__themes-trigger--active" : ""
                }`}
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
                className="public-header__nav-external"
                onClick={() => trackEvent("nav_boutique")}
              >
                {t(item.labelKey)}
              </a>
            ) : (
              <NavLinkNeon key={item.href} href={item.href} label={t(item.labelKey)} active={pathname === item.href} />
            ),
          )}
        </nav>

        <div className="public-header__actions">
          <LanguageSwitcher />
          <Link
            href="/chat"
            className="public-header__cta cta-chat btn-pulse group"
            onClick={() => trackEvent("cta_chat_header")}
          >
            <span aria-hidden>🤖</span>
            <span className="ml-2">{t("public.navExtra.exploreAI")}</span>
          </Link>
          <button
            type="button"
            className="public-header__menu-toggle"
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
          <div className="public-header__mobile">
            <nav className="public-header__mobile-nav" aria-label="Navigation mobile">
              <div className="public-header__mobile-header">
                <Link
                  href="/chat"
                  className="public-header__mobile-cta cta-chat"
                  onClick={() => {
                    trackEvent("cta_chat_header")
                    setMobileOpen(false)
                  }}
                >
                  <span aria-hidden>🤖</span>
                  <span className="ml-2">{t("public.navExtra.exploreAI")}</span>
                </Link>
                <button
                  type="button"
                    className="public-header__mobile-close"
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
                  className={`public-header__mobile-link ${
                    pathname === "/" ? "public-header__mobile-link--active" : ""
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {t("public.nav.home")}
                </Link>
              </div>
              <div className="mb-2 flex flex-col">
                <Link
                  href="/themes"
                  className={`public-header__mobile-link ${
                    pathname?.startsWith("/themes") ? "public-header__mobile-link--active" : ""
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {t("public.nav.themes")}
                </Link>
                {themes.map((th) => (
                  <Link
                    key={th.id}
                    href={`/themes/${th.slug}`}
                    className="public-header__mobile-theme-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="mr-2 select-none">{th.icon}</span>
                    {th.title}
                  </Link>
                ))}
              </div>
              <div className="public-header__mobile-list">
                {remainingNav.map((item) =>
                  item.external ? (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="public-header__mobile-link"
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
                      className={`public-header__mobile-link ${
                        pathname === item.href ? "public-header__mobile-link--active" : ""
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


