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
      className="relative md:fixed md:bottom-0 md:left-0 md:right-0 border-t border-zinc-800 bg-zinc-950 text-zinc-200"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-6 md:grid-cols-3">
        <div className="space-y-2">
          <Link href="/" className="font-semibold tracking-tight text-zinc-100">
            FLAASH
          </Link>
          <p className="text-sm text-zinc-400">{t("public.footer.strapline")}</p>
        </div>

        <nav aria-label="Ressources éditoriales" className="text-sm">
          <div className="font-medium text-zinc-100">{t("public.footer.resources")}</div>
          <ul className="mt-2 space-y-2 text-zinc-300">
            <li>
              <TrackedLink href="https://boutique.flaash.fr" external event="footer_boutique" className="hover:underline">
                {t("public.footer.shop")}
              </TrackedLink>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                {t("public.footer.about")}
              </Link>
            </li>
            <li>
              <Link href="/guide" className="hover:underline">
                {t("public.footer.guide")}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Légal et technique" className="text-sm">
          <div className="font-medium text-zinc-100">{t("public.footer.legalTech")}</div>
          <ul className="mt-2 space-y-2 text-zinc-300">
            <li>
              <Link href="/legal" className="hover:underline">
                {t("public.footer.legal")}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:underline">
                {t("public.footer.privacy")}
              </Link>
            </li>
            <li>
              <a href="https://dakkom.ai" target="_blank" rel="noreferrer noopener" className="hover:underline">
                {t("public.footer.engine")}
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 py-3 text-xs text-zinc-400">{t("public.footer.copyright").replace("{year}", String(year))}</div>
      </div>
    </footer>
  )
}


