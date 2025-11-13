"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { TrackedLink } from "@/components/public/TrackedLink"
import { useLanguage } from "@/lib/language-context"

export function PublicFooter() {
  const { t } = useLanguage()
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const setHeight = () => {
      const h = el.offsetHeight || 0
      if (typeof document !== "undefined") {
        document.documentElement.style.setProperty("--public-footer-height", `${h}px`)
      }
    }
    setHeight()
    const obs = new ResizeObserver(setHeight)
    obs.observe(el)
    window.addEventListener("resize", setHeight)
    return () => {
      obs.disconnect()
      window.removeEventListener("resize", setHeight)
    }
  }, [])
  const year = new Date().getFullYear()
  return (
    <footer
      ref={ref as any}
      role="contentinfo"
      className="public-footer"
    >
      <div className="public-footer__grid">
        <div className="public-footer__brand">
          <Link href="/" className="public-footer__brand-link">
            FLAASH
          </Link>
          <p className="public-footer__strapline">{t("public.footer.strapline")}</p>
        </div>

        <nav aria-label="Ressources éditoriales" className="public-footer__nav">
          <div className="public-footer__nav-title">{t("public.footer.resources")}</div>
          <ul className="public-footer__nav-list">
            <li>
              <TrackedLink href="https://boutique.flaash.fr" external event="footer_boutique" className="public-footer__link">
                {t("public.footer.shop")}
              </TrackedLink>
            </li>
            <li>
              <Link href="/about" className="public-footer__link">
                {t("public.footer.about")}
              </Link>
            </li>
            <li>
              <Link href="/guide" className="public-footer__link">
                {t("public.footer.guide")}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Légal et technique" className="public-footer__nav">
          <div className="public-footer__nav-title">{t("public.footer.legalTech")}</div>
          <ul className="public-footer__nav-list">
            <li>
              <Link href="/legal" className="public-footer__link">
                {t("public.footer.legal")}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="public-footer__link">
                {t("public.footer.privacy")}
              </Link>
            </li>
            <li>
              <a href="https://dakkom.ai" target="_blank" rel="noreferrer noopener" className="public-footer__link">
                {t("public.footer.engine")}
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="public-footer__bottom">
        <div className="public-footer__copyright">{t("public.footer.copyright").replace("{year}", String(year))}</div>
      </div>
    </footer>
  )
}


