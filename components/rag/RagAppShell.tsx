"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { MessageSquare, FileText, Upload, BookOpen, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FlaashWordmark } from "@/components/public/FlaashWordmark"
import { cn } from "@/lib/utils"

const ragNavigation = [
  { name: "Nouvelle conversation", href: "/rag", icon: MessageSquare },
  { name: "Liste des documents", href: "/rag/documents", icon: FileText },
  { name: "Gestion des documents", href: "/rag/upload", icon: Upload },
  { name: "Guides & inspirations", href: "/rag/guides", icon: BookOpen },
  { name: "Paramètres", href: "/rag/settings", icon: Settings },
]

export function RagAppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn("rag-shell", collapsed && "rag-shell--collapsed")}>
      <aside className="rag-sidebar">
        <div className="rag-sidebar__top">
          <Link href="/" className="rag-sidebar__logo">
            <FlaashWordmark />
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rag-sidebar__toggle"
            aria-label={collapsed ? "Agrandir la sidebar" : "Réduire la sidebar"}
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>
        </div>

        <nav className="rag-sidebar__nav">
          <ul>
            {ragNavigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/rag" && pathname.startsWith(item.href))
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn("rag-sidebar__link", isActive && "rag-sidebar__link--active")}
                  >
                    <item.icon className="size-5 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="rag-sidebar__footer">
          <p>FLAASH RAG v1.0</p>
        </div>
      </aside>

      <main className="rag-main">
        <header className="rag-main__header">
          <div>
            <p className="rag-main__eyebrow">FLAASH • Recherche augmentée</p>
            <h1>Agent IA conversationnel</h1>
            <p>Explorez vos documents entraînés, posez des questions et obtenez des réponses contextuelles basées sur votre base de connaissances.</p>
          </div>
          <div className="rag-main__cta-group">
            <Button asChild variant="outline" size="sm">
              <Link href="/rag/documents">Voir la base</Link>
            </Button>
            <Button asChild className="dashboard-cta-accent" size="sm">
              <Link href="/rag">Nouvelle conversation</Link>
            </Button>
          </div>
        </header>

        <div className="rag-main__content">{children}</div>
      </main>
    </div>
  )
}

