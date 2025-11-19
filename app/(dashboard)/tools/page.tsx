 "use client"

import type React from "react"
import { useState, useTransition } from "react"
import { DashboardGuard } from "@/components/dashboard/dashboard-guard"
import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

function Section({ title, description, children }: React.PropsWithChildren<{ title: string; description: string }>) {
  return (
    <Card className="space-y-4 p-6">
      <div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </Card>
  )
}

function DocumentListPanel() {
  const [documents, setDocuments] = useState<string[]>([])
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLoad = async () => {
    setIsLoading(true)
    try {
      const data = await listDocumentsAdmin()
      setDocuments(data.documents ?? [])
      setLastUpdated(new Date().toLocaleString())
      toast({
        title: "Liste mise à jour",
        description: `${data.documents?.length ?? 0} document(s) détecté(s).`,
      })
    } catch (error) {
      toast({
        title: "Impossible de charger la liste",
        description: error instanceof Error ? error.message : "Erreur inconnue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Section
      title="Liste des documents"
      description="Interrogez directement le vector store pour connaître les fichiers disponibles."
    >
      <div className="flex items-center gap-3">
        <Button onClick={handleLoad} disabled={isLoading}>
          {isLoading ? "Chargement…" : "Charger les documents"}
        </Button>
        {lastUpdated && <span className="text-xs text-muted-foreground">Dernière mise à jour : {lastUpdated}</span>}
      </div>
      <ScrollArea className="h-48 rounded-md border bg-muted/30 p-4">
        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun document chargé pour l’instant.</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {documents.map((doc) => (
              <li key={doc} className="font-mono text-xs">
                {doc}
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </Section>
  )
}

function SearchPanel() {
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
      } catch (error) {
        toast({
          title: "Erreur pendant la recherche",
          description: error instanceof Error ? error.message : "Erreur inconnue",
          variant: "destructive",
        })
      }
    })

  return (
    <Section
      title="Recherche vectorielle"
      description="Soumettez une requête directement au vector store Dakkom."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Question</Label>
          <Textarea rows={4} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Collection</Label>
            <Input value={collectionName} onChange={(e) => setCollectionName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Nombre de résultats : {limit}</Label>
            <Slider
              value={[limit]}
              max={20}
              min={1}
              step={1}
              onValueChange={([value]) => setLimit(value)}
            />
          </div>
          <Button onClick={runSearch} disabled={isPending}>
            {isPending ? "Recherche…" : "Lancer la recherche"}
          </Button>
        </div>
      </div>
      <ScrollArea className="h-64 rounded-md border bg-muted/30 p-4">
        {results.length === 0 ? (
          <p className="text-sm text-muted-foreground">Les résultats apparaîtront ici.</p>
        ) : (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={`${result.chunk_id ?? index}`} className="rounded-md border bg-white p-3 shadow-sm">
                <p className="text-xs text-muted-foreground">
                  Chunk <span className="font-mono">{String(result.chunk_id ?? index)}</span> — score{" "}
                  {typeof result.score === "number" ? result.score.toFixed(3) : "n/a"}
                </p>
                <p className="mt-2 text-sm">{String(result.snippet ?? result.document ?? "Aucun extrait")}</p>
                {result.metadata && (
                  <pre className="mt-2 rounded bg-muted p-2 text-[11px]">
                    {JSON.stringify(result.metadata, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Section>
  )
}

function RagPanel() {
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
          prompt: promptType,
          temperature,
        })
        const generated = (data as any)?.generated_response?.text ?? "Aucune réponse"
        setResponseText(generated)
        setRetrieved(((data as any)?.retrieved_documents as DakkomRetrievedDocument[]) ?? [])
        toast({ title: "RAG terminé", description: "Réponse générée." })
      } catch (error) {
        toast({
          title: "Erreur pendant la génération",
          description: error instanceof Error ? error.message : "Erreur inconnue",
          variant: "destructive",
        })
      }
    })

  return (
    <Section title="Génération RAG" description="Configurez les paramètres et inspectez la réponse.">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Question</Label>
          <Textarea rows={4} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Collection</Label>
            <Input value={collectionName} onChange={(e) => setCollectionName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Type de prompt</Label>
            <Select value={promptType} onValueChange={setPromptType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="long">Long</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Température : {temperature.toFixed(2)}</Label>
            <Slider
              value={[temperature]}
              min={0}
              max={1}
              step={0.05}
              onValueChange={([value]) => setTemperature(Number(value.toFixed(2)))}
            />
          </div>
          <Button onClick={runRag} disabled={isPending}>
            {isPending ? "Génération…" : "Générer la réponse"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border bg-muted/30 p-4">
          <h4 className="text-sm font-semibold">Réponse</h4>
          <p className="mt-2 text-sm">{responseText || "Aucune réponse pour l’instant."}</p>
        </div>
        <div className="rounded-md border bg-muted/30 p-4">
          <h4 className="text-sm font-semibold">Documents récupérés</h4>
          <ScrollArea className="mt-2 h-40">
            {retrieved.length === 0 ? (
              <p className="text-sm text-muted-foreground">Les citations apparaîtront ici.</p>
            ) : (
              <ul className="space-y-2 text-xs">
                {retrieved.map((doc, index) => (
                  <li key={`${doc.chunk_id ?? index}`} className="rounded bg-white p-2 shadow-sm">
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
    </Section>
  )
}

function EvaluationPanel() {
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
      } catch (error) {
        toast({
          title: "Erreur pendant l’évaluation",
          description: error instanceof Error ? error.message : "Erreur inconnue",
          variant: "destructive",
        })
      }
    })

  return (
    <Section
      title="Évaluation"
      description="Déclenchez un run d’évaluation (RAG) sur un jeu de tests défini côté backend."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Test set</Label>
          <Input value={testSet} onChange={(e) => setTestSet(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Type de prompt</Label>
          <Select value={promptType} onValueChange={setPromptType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short</SelectItem>
              <SelectItem value="long">Long</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={runEvaluation} disabled={isPending}>
        {isPending ? "Lancement…" : "Lancer l’évaluation"}
      </Button>
      <Textarea
        className="mt-4 font-mono text-xs"
        rows={8}
        value={result}
        readOnly
        placeholder="Les résultats JSON apparaîtront ici."
      />
    </Section>
  )
}

export default function AdminToolsPage() {
  return (
    <DashboardGuard requiredRole="admin">
      <PageHeader
        title="Outils RAG & Vector Store"
        description="Accédez aux outils internes pour gérer les documents, interroger le vector store, lancer des générations RAG ou déclencher des évaluations."
      />

      <div className="grid gap-6">
        <DocumentListPanel />
        <SearchPanel />
        <RagPanel />
        <EvaluationPanel />
      </div>
    </DashboardGuard>
  )
}

