"use client"

import { useState, useTransition } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import {
  evaluationAdmin,
  listDocumentsAdmin,
  ragGenerationAdmin,
  searchVectorStoreAdmin,
} from "@/lib/tools-api"
import type { DakkomRetrievedDocument } from "@/lib/dakkom-api"
import type { ToolHistoryEntryInput } from "@/hooks/use-tool-history"
import { DashboardSectionCard } from "@/components/dashboard/DashboardSectionCard"
import { DashboardFormSection, DashboardFormField, DashboardFormActions } from "@/components/dashboard/DashboardForm"

type PanelContext = "dashboard" | "chat"

interface PanelCallbacks {
  context?: PanelContext
  onHistory?: (entry: ToolHistoryEntryInput) => void
  onTrack?: (event: string, payload?: Record<string, unknown>) => void
}

export function ToolSection({
  title,
  description,
  meta,
  actions,
  children,
}: React.PropsWithChildren<{
  title: string
  description: string
  meta?: React.ReactNode
  actions?: React.ReactNode
}>) {
  return (
    <DashboardSectionCard title={title} description={description} meta={meta} actions={actions}>
      {children}
    </DashboardSectionCard>
  )
}

interface DocumentPanelProps extends PanelCallbacks {}

export function DocumentListPanel({ onHistory, onTrack, context = "dashboard" }: DocumentPanelProps = {}) {
  const [documents, setDocuments] = useState<string[]>([])
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLoad = async () => {
    setIsLoading(true)
    try {
      const data = await listDocumentsAdmin()
      const items = data.documents ?? []
      setDocuments(items)
      setLastUpdated(new Date().toLocaleString())
      toast({
        title: "Liste mise à jour",
        description: `${items.length} document(s) détecté(s).`,
      })
      onHistory?.({
        panel: "documents",
        params: { count: items.length, context },
        summary: `${items.length} document(s) listé(s)`,
        success: true,
      })
      onTrack?.("tools_documents_load", { context, count: items.length })
    } catch (error) {
      toast({
        title: "Impossible de charger la liste",
        description: error instanceof Error ? error.message : "Erreur inconnue",
        variant: "destructive",
      })
      onHistory?.({
        panel: "documents",
        params: { context },
        summary: error instanceof Error ? error.message : "Erreur inconnue",
        success: false,
      })
      onTrack?.("tools_documents_load_error", {
        context,
        message: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ToolSection
      title="Liste des documents"
      description="Interrogez directement le vector store pour connaître les fichiers disponibles."
    >
      <DashboardFormActions align="left">
        <Button onClick={handleLoad} disabled={isLoading} className="dashboard-cta-accent">
          {isLoading ? "Chargement…" : "Charger les documents"}
        </Button>
        {lastUpdated ? <span className="text-xs text-muted-foreground">Dernière mise à jour : {lastUpdated}</span> : null}
      </DashboardFormActions>
      <ScrollArea className="h-48 dashboard-panel-scroll">
        {documents.length === 0 ? (
          <p className="dashboard-panel-placeholder">Aucun document chargé pour l’instant.</p>
        ) : (
          <ul className="dashboard-panel-list">
            {documents.map((doc) => (
              <li key={doc} className="dashboard-panel-entry">
                {doc}
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </ToolSection>
  )
}

interface SearchPanelProps extends PanelCallbacks {
  maxResults?: number
  disabled?: boolean
}

export function SearchPanel({
  maxResults = 20,
  disabled,
  onHistory,
  onTrack,
  context = "dashboard",
}: SearchPanelProps = {}) {
  const [query, setQuery] = useState("Qui est à la rédaction de Flaash ?")
  const [collectionName, setCollectionName] = useState("document_collection")
  const [limit, setLimit] = useState(10)
  const [results, setResults] = useState<Array<Record<string, unknown>>>([])
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const runSearch = () =>
    startTransition(async () => {
      try {
        const data = await searchVectorStoreAdmin({ query, collection_name: collectionName, number: limit })
        const next = (data as { results?: Array<Record<string, unknown>> })?.results ?? []
        setResults(next)
        toast({
          title: "Recherche terminée",
          description: `${next.length} résultat(s).`,
        })
        onHistory?.({
          panel: "search",
          params: { query, collectionName, limit, context },
          summary: `${next.length} résultat(s)`,
          success: true,
        })
        onTrack?.("tools_search_run", {
          context,
          limit,
          queryLength: query.length,
          results: next.length,
        })
      } catch (error) {
        toast({
          title: "Erreur pendant la recherche",
          description: error instanceof Error ? error.message : "Erreur inconnue",
          variant: "destructive",
        })
        onHistory?.({
          panel: "search",
          params: { query, collectionName, limit, context },
          summary: error instanceof Error ? error.message : "Erreur inconnue",
          success: false,
        })
        onTrack?.("tools_search_error", {
          context,
          limit,
          queryLength: query.length,
          message: error instanceof Error ? error.message : String(error),
        })
      }
    })

  return (
    <ToolSection title="Recherche vectorielle" description="Soumettez une requête directement au vector store Dakkom.">
      <DashboardFormSection columns={2}>
        <DashboardFormField label="Question">
          <Textarea rows={4} value={query} onChange={(e) => setQuery(e.target.value)} disabled={disabled} />
        </DashboardFormField>
        <DashboardFormSection columns={1}>
          <DashboardFormField label="Collection">
            <Input value={collectionName} onChange={(e) => setCollectionName(e.target.value)} disabled={disabled} />
          </DashboardFormField>
          <DashboardFormField label={`Nombre de résultats : ${limit}`}>
            <Slider
              value={[limit]}
              max={maxResults}
              min={1}
              step={1}
              onValueChange={([value]) => setLimit(value)}
              disabled={disabled}
              className="slider-green"
            />
          </DashboardFormField>
          <DashboardFormActions align="left">
          <Button onClick={runSearch} disabled={isPending || disabled} className="dashboard-cta-accent">
              {isPending ? "Recherche…" : "Lancer la recherche"}
            </Button>
          </DashboardFormActions>
        </DashboardFormSection>
      </DashboardFormSection>
      <ScrollArea className="h-64 dashboard-panel-scroll">
        {results.length === 0 ? (
          <p className="dashboard-panel-placeholder">Les résultats apparaîtront ici.</p>
        ) : (
          <div className="dashboard-panel-card">
            {results.map((result, index) => (
              <div key={`${result.chunk_id ?? index}`} className="dashboard-panel-card__section bg-white">
                <p className="dashboard-panel-placeholder text-xs">
                  Chunk <span className="font-mono">{String(result.chunk_id ?? index)}</span> — score{" "}
                  {typeof result.score === "number" ? result.score.toFixed(3) : "n/a"}
                </p>
                <p className="dashboard-panel-card__text">{String(result.snippet ?? result.document ?? "Aucun extrait")}</p>
                {result.metadata && (
                  <pre className="mt-2 rounded bg-muted p-2 text-[11px]">
                    {JSON.stringify(result.metadata as Record<string, unknown>, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </ToolSection>
  )
}

interface RagProps extends PanelCallbacks {
  allowPromptSelection?: boolean
  allowTemperature?: boolean
  disabled?: boolean
}

export function RagPanel({
  allowPromptSelection = true,
  allowTemperature = true,
  disabled,
  onHistory,
  onTrack,
  context = "dashboard",
}: RagProps = {}) {
  const [query, setQuery] = useState("Qui est à la rédaction de Flaash ?")
  const [collectionName, setCollectionName] = useState("document_collection")
  const [promptType, setPromptType] = useState("long")
  const [temperature, setTemperature] = useState(0.5)
  const [responseText, setResponseText] = useState("")
  const [retrieved, setRetrieved] = useState<DakkomRetrievedDocument[]>([])
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const runRag = () =>
    startTransition(async () => {
      try {
        const data = await ragGenerationAdmin({
          query,
          collection_name: collectionName,
          ...(allowPromptSelection ? { prompt: promptType } : {}),
          ...(allowTemperature ? { temperature } : {}),
        })
        const generated = (data as any)?.generated_response?.text ?? "Aucune réponse"
        setResponseText(generated)
        setRetrieved(((data as any)?.retrieved_documents as DakkomRetrievedDocument[]) ?? [])
        toast({ title: "RAG terminé", description: "Réponse générée." })
        onHistory?.({
          panel: "rag",
          params: { query, collectionName, promptType, temperature, context },
          summary: response.slice(0, 120) || "Réponse vide",
          success: true,
        })
        onTrack?.("tools_rag_run", {
          context,
          promptType,
          temperature,
          retrieved: retrievedDocs.length,
          responseLength: response.length,
        })
      } catch (error) {
        toast({
          title: "Erreur pendant la génération",
          description: error instanceof Error ? error.message : "Erreur inconnue",
          variant: "destructive",
        })
        onHistory?.({
          panel: "rag",
          params: { query, collectionName, promptType, temperature, context },
          summary: error instanceof Error ? error.message : "Erreur inconnue",
          success: false,
        })
        onTrack?.("tools_rag_error", {
          context,
          promptType,
          temperature,
          message: error instanceof Error ? error.message : String(error),
        })
      }
    })

  return (
    <ToolSection title="Génération RAG" description="Configurez les paramètres et inspectez la réponse.">
      <DashboardFormSection columns={2}>
        <DashboardFormField label="Question">
          <Textarea rows={4} value={query} onChange={(e) => setQuery(e.target.value)} disabled={disabled} />
        </DashboardFormField>
        <DashboardFormSection columns={1}>
          <DashboardFormField label="Collection">
            <Input value={collectionName} onChange={(e) => setCollectionName(e.target.value)} disabled={disabled} />
          </DashboardFormField>
          {allowPromptSelection ? (
            <DashboardFormField label="Type de prompt">
              <Select value={promptType} onValueChange={setPromptType} disabled={disabled}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </DashboardFormField>
          ) : null}
          {allowTemperature ? (
            <DashboardFormField label={`Température : ${temperature.toFixed(2)}`}>
              <Slider
                value={[temperature]}
                min={0}
                max={1}
                step={0.05}
                onValueChange={([value]) => setTemperature(Number(value.toFixed(2)))}
                disabled={disabled}
                className="slider-green"
              />
            </DashboardFormField>
          ) : null}
          <DashboardFormActions align="left">
          <Button onClick={runRag} disabled={isPending || disabled} className="dashboard-cta-accent">
              {isPending ? "Génération…" : "Générer la réponse"}
            </Button>
          </DashboardFormActions>
        </DashboardFormSection>
      </DashboardFormSection>

      <div className="dashboard-panel-card md:grid md:grid-cols-2 md:gap-4">
        <div className="dashboard-panel-card__section">
          <h4 className="dashboard-panel-card__title">Réponse</h4>
          <p className="dashboard-panel-card__text">{responseText || "Aucune réponse pour l’instant."}</p>
        </div>
        <div className="dashboard-panel-card__section">
          <h4 className="dashboard-panel-card__title">Documents récupérés</h4>
          <ScrollArea className="mt-2 h-40">
            {retrieved.length === 0 ? (
              <p className="dashboard-panel-placeholder">Les citations apparaîtront ici.</p>
            ) : (
              <ul className="dashboard-panel-card__list">
                {retrieved.map((doc, index) => (
                  <li key={`${doc.chunk_id ?? index}`} className="dashboard-panel-card__list-item">
                    <p className="font-semibold">{doc.source_file ?? `Chunk ${doc.chunk_id}`}</p>
                    <p className="text-muted-foreground">
                      Score : {typeof doc.probability === "number" ? doc.probability.toFixed(3) : "n/a"}
                    </p>
                    {doc.document && <p className="mt-1">{doc.document}</p>}
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>
      </div>
    </ToolSection>
  )
}

interface EvalProps extends PanelCallbacks {
  disabled?: boolean
}

export function EvaluationPanel({ disabled, onHistory, onTrack, context = "dashboard" }: EvalProps = {}) {
  const [testSet, setTestSet] = useState("questions")
  const [promptType, setPromptType] = useState("long")
  const [result, setResult] = useState<string>("")
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const runEvaluation = () =>
    startTransition(async () => {
      try {
        const data = await evaluationAdmin({ test_set: testSet, prompt: promptType })
        setResult(JSON.stringify(data, null, 2))
        toast({ title: "Évaluation déclenchée" })
        onHistory?.({
          panel: "evaluation",
          params: { testSet, promptType, context },
          summary: data?.evaluation_id ? `ID ${data.evaluation_id}` : "Évaluation en cours",
          success: true,
        })
        onTrack?.("tools_evaluation_run", { context, testSet, promptType })
      } catch (error) {
        toast({
          title: "Erreur pendant l’évaluation",
          description: error instanceof Error ? error.message : "Erreur inconnue",
          variant: "destructive",
        })
        onHistory?.({
          panel: "evaluation",
          params: { testSet, promptType, context },
          summary: error instanceof Error ? error.message : "Erreur inconnue",
          success: false,
        })
        onTrack?.("tools_evaluation_error", {
          context,
          testSet,
          promptType,
          message: error instanceof Error ? error.message : String(error),
        })
      }
    })

  return (
    <ToolSection
      title="Évaluation"
      description={disabled ? "Disponible uniquement pour les administrateurs." : "Déclenchez un run d’évaluation RAG."}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardFormField label="Test set">
          <Input value={testSet} onChange={(e) => setTestSet(e.target.value)} disabled={disabled} />
        </DashboardFormField>
        <DashboardFormField label="Type de prompt">
          <Select value={promptType} onValueChange={setPromptType} disabled={disabled}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short</SelectItem>
              <SelectItem value="long">Long</SelectItem>
            </SelectContent>
          </Select>
        </DashboardFormField>
      </div>
      <DashboardFormActions align="left">
      <Button onClick={runEvaluation} disabled={isPending || disabled} className="dashboard-cta-accent">
          {isPending ? "Lancement…" : "Lancer l’évaluation"}
        </Button>
      </DashboardFormActions>
      <Textarea
        className="mt-4 font-mono text-xs"
        rows={8}
        value={result}
        readOnly
        placeholder="Les résultats JSON apparaîtront ici."
      />
    </ToolSection>
  )
}

