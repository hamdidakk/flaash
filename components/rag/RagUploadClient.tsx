"use client"

import { useMemo, useRef, useState } from "react"
import { Upload, File, Globe, CheckCircle2, AlertCircle, History } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { uploadDocument } from "@/lib/dakkom-api"
import { useErrorHandler } from "@/hooks/use-error-handler"
import { useToast } from "@/hooks/use-toast"
import { AppError } from "@/lib/error-handler"
import { useUploadHistory, type UploadHistoryEntry } from "@/hooks/use-upload-history"
import { DashboardFormSection, DashboardFormField, DashboardFormActions } from "@/components/dashboard/DashboardForm"

type SourceOption = "INTERNAL" | "WEB_PAGE" | "OTHER"

interface UploadEntry {
  id: string
  file: File
  progress: number
  status: "pending" | "uploading" | "completed" | "error"
  message?: string
}

export function RagUploadClient() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { handleError } = useErrorHandler()
  const { toast } = useToast()
  const { history, addHistoryEntry, clearHistory } = useUploadHistory(15)

  const [entries, setEntries] = useState<UploadEntry[]>([])
  const [source, setSource] = useState<SourceOption>("INTERNAL")
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [isValidated, setIsValidated] = useState(false)
  const [isQA, setIsQA] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const summary = useMemo(() => {
    if (entries.length === 0) return ""
    const completed = entries.filter((entry) => entry.status === "completed").length
    const failed = entries.filter((entry) => entry.status === "error").length
    const pending = entries.length - completed - failed
    return `${entries.length} fichier(s) → ${completed} terminés → ${pending} en attente${failed ? ` → ${failed} échec(s)` : ""}`
  }, [entries])

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const next: UploadEntry[] = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}`,
      file,
      progress: 0,
      status: "pending",
    }))
    setEntries((prev) => {
      const existing = new Set(prev.map((entry) => entry.id))
      const deduped = next.filter((entry) => !existing.has(entry.id))
      return [...prev, ...deduped]
    })
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragActive(false)
    handleFiles(event.dataTransfer.files)
  }

  const handleSubmit = async () => {
    if (entries.length === 0) {
      toast({ title: "Aucun fichier sélectionné" })
      return
    }
    if (source === "WEB_PAGE" && !url.trim()) {
      toast({ title: "URL requise", description: "Pour les sources web, indiquez l’URL à indexer.", variant: "destructive" })
      return
    }
    setIsUploading(true)
    setEntries((prev) => prev.map((entry) => ({ ...entry, status: "uploading", progress: 12, message: undefined })))
    let successCount = 0
    for (const entry of entries) {
      try {
        const form = new FormData()
        form.append("file", entry.file)
        form.append("source", source)
        form.append("is_validated", String(isValidated))
        form.append("is_qa", String(isQA))
        form.append("description", description)
        if (source === "WEB_PAGE") {
          form.append("url", url)
        }
        await uploadDocument(form)
        setEntries((prev) =>
          prev.map((item) => (item.id === entry.id ? { ...item, status: "completed", progress: 100 } : item)),
        )
        successCount += 1
        addHistoryEntry({
          id: `${entry.id}-success-${Date.now()}`,
          name: entry.file.name,
          size: entry.file.size,
          source,
          status: "success",
          timestamp: Date.now(),
        })
      } catch (error) {
        let message = "Échec inattendu."
        if (error instanceof AppError) {
          message = error.message || message
        } else if (error instanceof Error) {
          message = error.message
        }
        handleError(error, { title: `Erreur sur ${entry.file.name}`, showToast: false })
        setEntries((prev) =>
          prev.map((item) => (item.id === entry.id ? { ...item, status: "error", progress: 0, message } : item)),
        )
        addHistoryEntry({
          id: `${entry.id}-error-${Date.now()}`,
          name: entry.file.name,
          size: entry.file.size,
          source,
          status: "error",
          timestamp: Date.now(),
          message,
        })
      }
    }
    toast({
      title: "Upload terminé",
      description: "Les fichiers ont été transmis au backend Dakkom.",
    })
    if (typeof window !== "undefined" && successCount > 0) {
      window.sessionStorage.setItem(
        "rag:last-upload",
        JSON.stringify({ timestamp: Date.now(), count: successCount }),
      )
    }
    setIsUploading(false)
  }

  const resetForm = () => {
    setEntries([])
    setDescription("")
    setIsValidated(false)
    setIsQA(false)
    setUrl("")
    setSource("INTERNAL")
    fileInputRef.current?.form?.reset()
  }

  return (
    <div className="rag-upload rag-stack">
      <Card className="rag-card">
        <div className="rag-card__header rag-card__header--start">
          <div>
            <p className="rag-meta-label">Ajout assisté</p>
            <h2 className="rag-card__title">Uploader des documents</h2>
            <p className="rag-card__subtitle">
              Glissez vos PDF, DOCX, TXT ou Markdown. Chaque fichier sera poussé vers Dakkom pour alimenter le RAG.
            </p>
          </div>
          <div className="rag-card__stat">
            <p className="rag-card__stat-label">Statut</p>
            <p className="rag-card__stat-value">{summary || "En attente"}</p>
          </div>
        </div>
      </Card>

      <div className="rag-layout--split">
        <Card className="rag-card rag-stack--dense">
          <DashboardFormSection columns={source === "WEB_PAGE" ? 1 : 2} tone="dark">
            <DashboardFormField label="Source">
              <Select value={source} onValueChange={(value: SourceOption) => setSource(value)}>
                <SelectTrigger className="mt-2 rag-select-trigger">
                  <SelectValue placeholder="Choisir une source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTERNAL">Interne</SelectItem>
                  <SelectItem value="WEB_PAGE">Page web</SelectItem>
                  <SelectItem value="OTHER">Autre</SelectItem>
                </SelectContent>
              </Select>
            </DashboardFormField>

            {source === "WEB_PAGE" ? (
              <DashboardFormField label="URL liée" htmlFor="url">
                <div className="mt-2 rag-input-wrapper">
                  <Globe className="h-4 w-4 text-white/60" />
                  <Input
                    id="url"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    placeholder="https://exemple.com/article"
                    className="rag-input--inline"
                  />
                </div>
              </DashboardFormField>
            ) : null}
          </DashboardFormSection>

          <DashboardFormSection columns={1} tone="dark">
            <DashboardFormField label="Notes (facultatif)" htmlFor="description">
              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Ajoutez un contexte, une version ou une portée d'usage."
                className="mt-2 rag-input"
                rows={3}
              />
            </DashboardFormField>
          </DashboardFormSection>

          <DashboardFormSection columns={2} tone="dark">
            <DashboardFormField label="Document validé" htmlFor="validated">
              <div className="rag-toolbar rag-toolbar--compact">
                <Switch id="validated" checked={isValidated} onCheckedChange={setIsValidated} />
                <span className="rag-text-accent">Indique que la source est vérifiée.</span>
              </div>
            </DashboardFormField>
            <DashboardFormField label="Mode Q&A" htmlFor="qa">
              <div className="rag-toolbar rag-toolbar--compact">
                <Switch id="qa" checked={isQA} onCheckedChange={setIsQA} />
                <span className="rag-text-accent">Prépare le document pour des questions directes.</span>
              </div>
            </DashboardFormField>
          </DashboardFormSection>

          <div
            className={`rag-upload__dropzone ${dragActive ? "rag-upload__dropzone--active" : ""}`}
            onDragOver={(event) => {
              event.preventDefault()
              setDragActive(true)
            }}
            onDragLeave={(event) => {
              event.preventDefault()
              setDragActive(false)
            }}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-10 w-10 text-white/70" />
            <p className="rag-text-lead">Glissez vos fichiers ou cliquez pour parcourir</p>
            <p className="rag-text-caption">Formats acceptés : PDF, DOCX, TXT, MD (max ~20 Mo)</p>
            <Button variant="secondary" className="rag-button-ghost">
              Sélectionner des fichiers
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.docx,.txt,.md"
              onChange={(event) => handleFiles(event.target.files)}
            />
          </div>

          {entries.length > 0 && (
            <div className="rag-stack--dense">
              {entries.map((entry) => (
                <Card key={entry.id} className="rag-card bg-white/[0.03] p-4">
                  <div className="rag-toolbar rag-toolbar--wrap">
                    <File className="h-5 w-5 text-white/60" />
                    <div className="flex-1">
                    <div className="rag-toolbar rag-toolbar--between">
                      <p className="rag-table__title">{entry.file.name}</p>
                        <Badge
                          variant="outline"
                          className={
                            entry.status === "completed"
                              ? "border-green-400 text-green-300"
                              : entry.status === "error"
                                ? "border-red-400 text-red-300"
                                : "border-white/30 text-white/80"
                          }
                        >
                          {entry.status === "completed"
                            ? "Terminé"
                            : entry.status === "error"
                              ? "Erreur"
                              : entry.status === "uploading"
                                ? "Envoi…"
                                : "En attente"}
                        </Badge>
                      </div>
                      <p className="rag-text-note">{(entry.file.size / 1024 / 1024).toFixed(2)} Mo</p>
                      <Progress value={entry.progress} className="mt-2" />
                      {entry.message && <p className="rag-text-note-danger">{entry.message}</p>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <DashboardFormActions>
            <Button variant="ghost" className="rag-button-ghost" onClick={resetForm} disabled={isUploading}>
              Réinitialiser
            </Button>
            <Button
              className="dashboard-cta-accent"
              onClick={handleSubmit}
              disabled={isUploading || entries.length === 0}
            >
              Lancer l’upload
            </Button>
          </DashboardFormActions>
        </Card>

        <div className="rag-stack">
          <Card className="rag-card rag-stack--dense">
            <div className="rag-toolbar">
              <CheckCircle2 className="h-5 w-5 text-[var(--color-flaash-green)]" />
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">Checklist</p>
                <h3 className="text-lg font-semibold text-white">Avant l’envoi</h3>
              </div>
            </div>
            <ul className="rag-list">
              <li><span className="rag-arrow">→</span> Vérifiez que le document ne contient pas de données confidentielles.</li>
              <li><span className="rag-arrow">→</span> Ajoutez des notes pour contextualiser les futures réponses.</li>
              <li><span className="rag-arrow">→</span> Utilisez "Document validé" uniquement pour les sources officielles.</li>
              <li><span className="rag-arrow">→</span> "Mode Q&A" prépare le fichier pour un questionnement direct.</li>
            </ul>

            <div className="rag-note-card">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <AlertCircle className="h-4 w-4 text-yellow-300" />
                Bon à savoir
              </div>
              <p>
                Chaque upload déclenche un traitement côté Dakkom (vectorisation + indexation). La disponibilité dans le RAG
                peut prendre quelques minutes selon la taille du document.
              </p>
            </div>
          </Card>

          <Card className="rag-card rag-stack--dense">
            <div className="rag-toolbar rag-toolbar--between">
              <div className="rag-toolbar rag-toolbar--compact">
                <History className="h-4 w-4 text-[var(--color-flaash-green)]" />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">Historique</p>
                  <h3 className="text-lg font-semibold text-white">Derniers uploads</h3>
                </div>
              </div>
              {history.length > 0 && (
                <Button variant="ghost" size="sm" className="rag-button-ghost" onClick={clearHistory}>
                  Vider
                </Button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="rag-text-muted">Aucun envoi enregistré pour l’instant.</p>
            ) : (
              <ul className="rag-list">
                {history.map((entry: UploadHistoryEntry) => (
                  <li key={entry.id} className="rag-history-item">
                    <div className="rag-toolbar rag-toolbar--between rag-toolbar--compact">
                      <span className="font-medium">{entry.name}</span>
                      <span
                        className={
                          entry.status === "confirmed"
                            ? "text-[var(--color-flaash-green)]"
                            : entry.status === "success"
                              ? "text-emerald-300"
                              : entry.status === "error"
                                ? "text-red-300"
                                : ""
                        }
                      >
                        {entry.status === "confirmed"
                          ? "Confirmé"
                          : entry.status === "success"
                            ? "Succès"
                            : "Erreur"}
                      </span>
                    </div>
                    <p className="rag-text-note">
                      <span>{entry.source} <span className="rag-arrow">→</span> {(entry.size / 1024 / 1024).toFixed(2)} Mo <span className="rag-arrow">→</span>{" "}
                      {new Date(entry.timestamp).toLocaleTimeString("fr-FR")}</span>
                    </p>
                    {entry.status === "confirmed" && entry.confirmedAt && (
                      <p className="rag-text-note-strong">
                        Confirmé via la base à {new Date(entry.confirmedAt).toLocaleTimeString("fr-FR")}
                      </p>
                    )}
                    {entry.message && <p className="rag-text-note-danger">{entry.message}</p>}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

