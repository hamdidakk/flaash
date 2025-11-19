"use client"

import Link from "next/link"
import Image from "next/image"
import { trackEvent } from "@/lib/analytics"
import { usePathname, useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { useEffect, useState } from "react"
import { NavLinkNeon } from "@/components/public/ui/NavLinkNeon"
import { LanguageSwitcher } from "@/components/public/LanguageSwitcher"
import { useSessionStore } from "@/store/session-store"

type NavItem = {
  href: string
  labelKey: string
  external?: boolean
}

const navItems: NavItem[] = [
  { href: "/", labelKey: "public.nav.home" },
  { href: "/about", labelKey: "public.nav.about" },
  { href: "/guide", labelKey: "public.nav.guide" },
  { href: "/themes", labelKey: "public.nav.themes" },
  { href: "/abonnement", labelKey: "public.nav.subscription" },
]

export function PublicHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { t, language } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { status } = useSessionStore()
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
        <Link href="/" className="public-header__logo-link mr-12" aria-label="Accueil FLAASH">
          <span className="font-sans text-5xl font-semibold tracking-[0.15em] uppercase select-none text-foreground inline-flex items-center">
            FLA<span className="inline-block rotate-180 -ml-8 mr-1">A</span>SH
          </span>
        </Link>

        <nav className="public-header__nav" aria-label="Navigation principale">
          {navItems.map((item) =>
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
          <button
            type="button"
            className="public-header__cta cta-chat btn-pulse group"
            onClick={() => {
              trackEvent("cta_chat_header")
              if (status === "authenticated") {
                router.push("/chat")
              } else {
                router.push("/login?redirect=/chat")
              }
            }}
          >
            <span aria-hidden>🤖</span>
            <span className="ml-2">{t("public.navExtra.exploreAI")}</span>
          </button>
          <LanguageSwitcher variant="menu" />
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
                <button
                  type="button"
                  className="public-header__mobile-cta cta-chat"
                  onClick={() => {
                    trackEvent("cta_chat_header")
                    setMobileOpen(false)
                    if (status === "authenticated") {
                      router.push("/chat")
                    } else {
                      router.push("/login?redirect=/chat")
                    }
                  }}
                >
                  <span aria-hidden>🤖</span>
                  <span className="ml-2">{t("public.navExtra.exploreAI")}</span>
                </button>
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
              <div className="public-header__mobile-list">
                {navItems.map((item) =>
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
                      className={`public-header__mobile-link ${pathname === item.href ? "public-header__mobile-link--active" : ""
                        }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {t(item.labelKey)}
                    </Link>
                  ),
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}


