"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { MessageSquare, FileText, Upload, BookOpen, Settings, ChevronLeft, ChevronRight, LogOut, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FlaashWordmark } from "@/components/public/FlaashWordmark"
import { cn } from "@/lib/utils"
import { useSessionStore } from "@/store/session-store"
import { RagLoginModal } from "./RagLoginModal"

const ragNavigation = [
  { name: "Nouvelle conversation", href: "/", icon: MessageSquare },
  { name: "Liste des documents", href: "/rag/documents", icon: FileText },
  { name: "Gestion des documents", href: "/rag/upload", icon: Upload },
  { name: "Guides & inspirations", href: "/rag/guides", icon: BookOpen },
  { name: "Paramètres", href: "/rag/settings", icon: Settings },
]

export function RagAppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const pathname = usePathname()
  const { user, status, logout } = useSessionStore()

  // Mémoriser la navigation avec les états actifs pour éviter les recalculs
  const navigationWithActive = useMemo(() => {
    return ragNavigation.map((item) => ({
      ...item,
      isActive: pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)),
    }))
  }, [pathname])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }

  const userDisplayName = (user?.email as string) || (user?.username as string) || (user?.name as string) || "Utilisateur"

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
            {navigationWithActive.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn("rag-sidebar__link", item.isActive && "rag-sidebar__link--active")}
                >
                  <item.icon className="size-5 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="rag-sidebar__footer">
          {status === "authenticated" && user ? (
            <div className="rag-sidebar__user">
              <div className="rag-sidebar__user-info">
                <p className="rag-sidebar__user-name">{userDisplayName}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="rag-sidebar__logout"
                onClick={handleLogout}
                title="Déconnexion"
              >
                <LogOut className="size-4" />
                {!collapsed && <span>Déconnexion</span>}
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="rag-sidebar__login"
              onClick={() => setShowLoginModal(true)}
              title="Connexion"
            >
              <LogIn className="size-4" />
              {!collapsed && <span>Connexion</span>}
            </Button>
          )}
        </div>
      </aside>

      <main className="rag-main">
        <header className="rag-main__header">
          <div>
            <p className="rag-main__eyebrow">FLAASH <span className="rag-arrow">→</span> Recherche augmentée</p>
            <h1>Agent IA conversationnel</h1>
            <p>Explorez vos documents entraînés, posez des questions et obtenez des réponses contextuelles basées sur votre base de connaissances.</p>
          </div>
          <div className="rag-main__cta-group">
            <Button asChild variant="outline" size="sm">
              <Link href="/rag/documents">Voir la base</Link>
            </Button>
            <Button asChild className="dashboard-cta-accent" size="sm">
              <Link href="/">Nouvelle conversation</Link>
            </Button>
          </div>
        </header>

        <div className="rag-main__content">{children}</div>
      </main>
      <RagLoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </div>
  )
}

