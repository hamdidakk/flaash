"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { MessageCircle, FileText, Upload, Settings, PanelLeft, PanelRight, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/rag", label: "Conversations", icon: MessageCircle },
  { href: "/rag/documents", label: "Documents", icon: FileText },
  { href: "/rag/upload", label: "Ajouter", icon: Upload },
  { href: "/rag/guides", label: "Guides", icon: BookOpen },
  { href: "/rag/settings", label: "Paramètres", icon: Settings },
]

export function RagAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={cn("rag-shell", collapsed && "rag-shell--collapsed")}>
      <aside className="rag-sidebar">
        <div className="rag-sidebar__top">
          <Link href="/" className="rag-sidebar__logo">
            <span>FLAASH RAG</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="rag-sidebar__toggle"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Ouvrir la barre latérale" : "Réduire la barre latérale"}
          >
            {collapsed ? <PanelRight className="size-4" /> : <PanelLeft className="size-4" />}
          </Button>
        </div>

        <nav className="rag-sidebar__nav">
          <span className="rag-sidebar__section">Navigation</span>
          <ul>
            {navItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn("rag-sidebar__link", active && "rag-sidebar__link--active")}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="rag-sidebar__footer">
          <p className="rag-sidebar__caption">v0.1 – Demo</p>
          <p className="rag-sidebar__caption">Back-end connecté</p>
        </div>
      </aside>

      <div className="rag-main">
        <header className="rag-main__header">
          <div>
            <p className="rag-main__eyebrow">FLAASH • Recherche augmentée</p>
            <h1>Concevez vos réponses augmentées</h1>
            <p>
              Centralisez vos documents, entraînez le RAG et supervisez chaque itération dans un espace dédié.
            </p>
          </div>
          <div className="rag-main__cta-group">
            <Button asChild size="lg" className="dashboard-cta-accent">
              <Link href="/rag/upload">Ajouter des documents</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/rag/documents">Voir la base</Link>
            </Button>
          </div>
        </header>

        <main className="rag-main__content">{children}</main>
      </div>
    </div>
  )
}

