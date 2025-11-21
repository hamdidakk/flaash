"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Lightbulb, Code, CheckCircle2, AlertCircle, FileText, MessageSquare, Search, Upload } from "lucide-react"
import Link from "next/link"

export function RagGuidesClient() {
  return (
    <div className="rag-stack">
      <div>
        <h1 className="rag-page-heading">Guides & Inspirations</h1>
        <p className="rag-page-subtitle">Découvrez les meilleures pratiques pour exploiter pleinement le RAG FLAASH.</p>
      </div>

      {/* Quick Start */}
      <Card className="rag-card">
        <div className="rag-toolbar rag-toolbar--start">
          <div className="rag-icon-badge rag-icon-badge--green">
            <CheckCircle2 className="size-6" />
          </div>
          <div className="flex-1">
            <h2 className="rag-title-lg">Démarrage rapide</h2>
            <p className="mt-2 rag-text-caption">Suivez ces étapes pour commencer à utiliser le RAG efficacement.</p>
            <ol className="mt-4 rag-list--numbered">
              <li className="flex gap-3">
                <span className="rag-step-badge">
                  1
                </span>
                <div>
                  <strong>Ajoutez vos documents</strong> via la page{" "}
                  <Link href="/rag/upload" className="rag-link">
                    Ajouter
                  </Link>
                  . Formats supportés : PDF, DOCX, TXT, MD.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="rag-step-badge">
                  2
                </span>
                <div>
                  <strong>Vérifiez le traitement</strong> dans{" "}
                  <Link href="/rag/documents" className="rag-link">
                    Documents
                  </Link>
                  . Attendez que les chunks soient générés.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="rag-step-badge">
                  3
                </span>
                <div>
                  <strong>Posez vos questions</strong> dans{" "}
                  <Link href="/rag" className="rag-link">
                    Conversations
                  </Link>
                  . L'IA répondra en s'appuyant sur vos documents.
                </div>
              </li>
            </ol>
          </div>
        </div>
      </Card>

      {/* Best Practices */}
      <div className="rag-grid-guides">
        <Card className="rag-card">
          <div className="rag-toolbar rag-toolbar--start">
            <div className="rag-icon-badge rag-icon-badge--blue">
              <Lightbulb className="size-6" />
            </div>
            <div className="flex-1">
              <h3 className="rag-title-lg">Bonnes pratiques</h3>
              <ul className="mt-3 rag-list--compact rag-text-muted">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-500" />
                  <span>Utilisez des documents structurés et bien formatés pour de meilleurs résultats.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-500" />
                  <span>Posez des questions précises et contextuelles plutôt que des questions trop générales.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-500" />
                  <span>Vérifiez les citations pour valider la pertinence des réponses.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-green-500" />
                  <span>Organisez vos documents par collections pour un meilleur ciblage.</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <Card className="rag-card">
          <div className="rag-toolbar rag-toolbar--start">
            <div className="rag-icon-badge rag-icon-badge--amber">
              <AlertCircle className="size-6" />
            </div>
            <div className="flex-1">
              <h3 className="rag-title-lg">Pièges à éviter</h3>
              <ul className="mt-3 rag-list--compact rag-text-muted">
                <li className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-500" />
                  <span>Ne mélangez pas des documents de domaines très différents dans une même collection.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-500" />
                  <span>Évitez les documents trop volumineux (préférez les découper en sections).</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-500" />
                  <span>Ne comptez pas uniquement sur le RAG pour des informations critiques sans vérification.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 size-4 shrink-0 text-amber-500" />
                  <span>N'oubliez pas de mettre à jour vos documents lorsque les informations changent.</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Examples */}
      <Card className="rag-card">
        <div className="rag-toolbar rag-toolbar--start">
          <div className="rag-icon-badge rag-icon-badge--purple">
            <Code className="size-6" />
          </div>
          <div className="flex-1">
            <h2 className="rag-title-lg">Exemples de questions</h2>
            <p className="mt-2 text-sm rag-text-muted">
              Voici des exemples de questions efficaces pour tirer le meilleur parti du RAG.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rag-surface-card text-sm">
                <div className="rag-toolbar rag-toolbar--compact">
                  <MessageSquare className="size-4 text-[var(--color-flaash-green)]" />
                  <span className="text-sm font-medium">Questions factuelles</span>
                </div>
                <ul className="mt-3 rag-list--compact rag-text-muted">
                  <li>"Quelles sont les principales conclusions du document X ?"</li>
                  <li>"Résume les points clés de la section Y."</li>
                  <li>"Quels sont les chiffres mentionnés concernant Z ?"</li>
                </ul>
              </div>
              <div className="rag-surface-card text-sm">
                <div className="rag-toolbar rag-toolbar--compact">
                  <Search className="size-4 text-[var(--color-flaash-green)]" />
                  <span className="text-sm font-medium">Recherche comparative</span>
                </div>
                <ul className="mt-3 rag-list--compact rag-text-muted">
                  <li>"Compare les approches A et B présentées dans les documents."</li>
                  <li>"Quelles sont les différences entre X et Y ?"</li>
                  <li>"Quels documents traitent du sujet Z ?"</li>
                </ul>
              </div>
              <div className="rag-surface-card text-sm">
                <div className="rag-toolbar rag-toolbar--compact">
                  <FileText className="size-4 text-[var(--color-flaash-green)]" />
                  <span className="text-sm font-medium">Analyse contextuelle</span>
                </div>
                <ul className="mt-3 rag-list--compact rag-text-muted">
                  <li>"Explique le contexte historique de X."</li>
                  <li>"Quelles sont les implications de Y selon les documents ?"</li>
                  <li>"Comment Z est-il abordé dans différents documents ?"</li>
                </ul>
              </div>
              <div className="rag-surface-card text-sm">
                <div className="rag-toolbar rag-toolbar--compact">
                  <Upload className="size-4 text-[var(--color-flaash-green)]" />
                  <span className="text-sm font-medium">Synthèse</span>
                </div>
                <ul className="mt-3 rag-list--compact rag-text-muted">
                  <li>"Fais une synthèse des points communs entre tous les documents."</li>
                  <li>"Quels sont les thèmes récurrents dans ma base de documents ?"</li>
                  <li>"Résume l'évolution de X à travers les documents."</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tips */}
      <Card className="rag-card">
        <div className="rag-toolbar rag-toolbar--start">
          <div className="rag-icon-badge rag-icon-badge--green">
            <BookOpen className="size-6" />
          </div>
          <div className="flex-1">
            <h2 className="rag-title-lg">Conseils avancés</h2>
            <div className="mt-4 rag-stack--dense">
              <div>
                <h4 className="font-medium">Optimisation des paramètres</h4>
                <p className="mt-1 text-sm rag-text-muted">
                  Ajustez la température et le type de prompt dans les{" "}
                  <Link href="/rag/settings" className="text-[var(--color-flaash-green)] hover:underline">
                    Paramètres
                  </Link>
                  . Une température plus basse (0.3-0.5) donne des réponses plus factuelles, tandis qu'une température
                  plus élevée (0.7-1.0) favorise la créativité.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Gestion des collections</h4>
                <p className="mt-1 text-sm rag-text-muted">
                  Organisez vos documents en collections thématiques pour améliorer la précision des réponses. Utilisez
                  des collections spécifiques lorsque vous posez des questions sur un domaine particulier.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Vérification des sources</h4>
                <p className="mt-1 text-sm rag-text-muted">
                  Toujours vérifier les citations fournies par l'IA. Cliquez sur les références pour voir les chunks
                  exacts utilisés pour générer la réponse.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

