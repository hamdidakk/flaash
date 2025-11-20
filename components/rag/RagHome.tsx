"use client"

import { Suspense } from "react"
import { QuickAsk } from "@/components/public/blocks/QuickAsk"
import { PublicWidget } from "@/components/public/Widget"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

const suggestions = [
  "Comment résumer ce rapport en 3 insights actionnables ?",
  "Quelles tendances émergentes en robotique urbaine ?",
  "Quels auteurs sont les plus cités dans nos notes ?",
]

export function RagHome() {
  return (
    <div className="rag-home">
      <section className="rag-home__intro">
        <Card className="rag-home__card rag-home__card--hero">
          <div>
            <p className="rag-home__eyebrow">🚀 Espace expérimental</p>
            <h2>Posez vos questions, testez les réponses, itérez avec le RAG</h2>
            <p>
              Demandez une analyse, une synthèse ou une exploration. Le modèle s’appuie uniquement sur les documents
              entraînés depuis votre backoffice Dakkom.
            </p>
          </div>
          <div className="rag-home__quick-actions">
            {suggestions.map((prompt) => (
              <Button key={prompt} variant="outline" className="rag-button--prompt">
                <span>{prompt}</span>
                <ArrowRight className="size-4" />
              </Button>
            ))}
          </div>
        </Card>
      </section>

      <section className="rag-home__panel">
        <Card className="rag-home__card">
          <div className="rag-home__panel-header">
            <Sparkles className="size-4 text-[var(--color-flaash-green)]" />
            <div>
              <h3>Question rapide</h3>
              <p>Lancez une question instantanément (redirigé vers le chat complet).</p>
            </div>
          </div>
          <QuickAsk placeholder="Ex : Quels enseignements tirés du dernier board ?" ctaLabel="Ouvrir le chat" />
        </Card>

        <Card className="rag-home__card">
          <div className="rag-home__panel-header">
            <Sparkles className="size-4 text-[var(--color-flaash-green)]" />
            <div>
              <h3>Historique & diagnostics</h3>
              <p>Réutilisez vos conversations récentes depuis le dashboard.</p>
            </div>
          </div>
          <Button asChild variant="ghost" className="rag-link-button px-0">
            <Link href="/rag/documents">
              Voir les documents suivis
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Card>
      </section>

      <section className="rag-home__chat">
        <Suspense fallback={<Card className="p-6 text-sm text-muted-foreground">Chargement du chat…</Card>}>
          <PublicWidget />
        </Suspense>
      </section>
    </div>
  )
}

