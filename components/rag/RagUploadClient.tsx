"use client"

import { useMemo, useRef, useState } from "react"
import { Upload, File, Globe, CheckCircle2, AlertCircle, History } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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
    return `${entries.length} fichier(s) • ${completed} terminés • ${pending} en attente${failed ? ` • ${failed} échec(s)` : ""}`
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
    <div className="rag-upload space-y-6">
      <Card className="border border-white/10 bg-white/[0.05] p-6 text-white">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Ajout assisté</p>
            <h2 className="mt-2 text-2xl font-semibold">Uploader des documents</h2>
            <p className="text-sm text-white/70">
              Glissez vos PDF, DOCX, TXT ou Markdown. Chaque fichier sera poussé vers Dakkom pour alimenter le RAG.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Statut</p>
            <p className="text-base font-semibold">{summary || "En attente"}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="space-y-5 border border-white/10 bg-white/[0.02] p-6 text-white">
          <div>
            <Label className="text-white">Source</Label>
            <Select value={source} onValueChange={(value: SourceOption) => setSource(value)}>
              <SelectTrigger className="mt-2 border-white/20 bg-white/5 text-white">
                <SelectValue placeholder="Choisir une source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INTERNAL">Interne</SelectItem>
                <SelectItem value="WEB_PAGE">Page web</SelectItem>
                <SelectItem value="OTHER">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {source === "WEB_PAGE" && (
            <div>
              <Label className="text-white" htmlFor="url">
                URL liée
              </Label>
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3">
                <Globe className="h-4 w-4 text-white/60" />
                <Input
                  id="url"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://exemple.com/article"
                  className="border-0 bg-transparent text-white placeholder:text-white/50 focus-visible:ring-0"
                />
              </div>
            </div>
          )}

          <div>
            <Label className="text-white" htmlFor="description">
              Notes (facultatif)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Ajoutez un contexte, une version ou une portée d'usage."
              className="mt-2 border-white/20 bg-white/5 text-white placeholder:text-white/50"
              rows={3}
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <Switch id="validated" checked={isValidated} onCheckedChange={setIsValidated} />
              <Label htmlFor="validated" className="text-white">
                Document validé
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="qa" checked={isQA} onCheckedChange={setIsQA} />
              <Label htmlFor="qa" className="text-white">
                Mode Q&A
              </Label>
            </div>
          </div>

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
            <p className="text-base font-semibold">Glissez vos fichiers ou cliquez pour parcourir</p>
            <p className="text-sm text-white/70">Formats acceptés : PDF, DOCX, TXT, MD (max ~20 Mo)</p>
            <Button variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
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
            <div className="space-y-3">
              {entries.map((entry) => (
                <Card key={entry.id} className="border-white/10 bg-white/[0.03] p-4 text-white">
                  <div className="flex flex-wrap items-start gap-3">
                    <File className="h-5 w-5 text-white/60" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{entry.file.name}</p>
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
                      <p className="text-xs text-white/60">{(entry.file.size / 1024 / 1024).toFixed(2)} Mo</p>
                      <Progress value={entry.progress} className="mt-2" />
                      {entry.message && <p className="mt-1 text-xs text-red-200">{entry.message}</p>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="ghost" className="text-white hover:bg-white/10" onClick={resetForm} disabled={isUploading}>
              Réinitialiser
            </Button>
            <Button
              className="bg-[var(--color-flaash-green)] text-white hover:bg-[var(--color-flaash-green-hover)]"
              onClick={handleSubmit}
              disabled={isUploading || entries.length === 0}
            >
              Lancer l’upload
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-4 border border-white/10 bg-white/[0.03] p-6 text-white">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-[var(--color-flaash-green)]" />
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">Checklist</p>
                <h3 className="text-lg font-semibold text-white">Avant l’envoi</h3>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-white/80">
              <li>• Vérifiez que le document ne contient pas de données confidentielles.</li>
              <li>• Ajoutez des notes pour contextualiser les futures réponses.</li>
              <li>• Utilisez “Document validé” uniquement pour les sources officielles.</li>
              <li>• “Mode Q&A” prépare le fichier pour un questionnement direct.</li>
            </ul>

            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 text-sm text-white/80">
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

          <Card className="space-y-3 border border-white/10 bg-white/[0.03] p-6 text-white">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-[var(--color-flaash-green)]" />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">Historique</p>
                  <h3 className="text-lg font-semibold text-white">Derniers uploads</h3>
                </div>
              </div>
              {history.length > 0 && (
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={clearHistory}>
                  Vider
                </Button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-white/60">Aucun envoi enregistré pour l’instant.</p>
            ) : (
              <ul className="space-y-3 text-sm text-white/80">
                {history.map((entry: UploadHistoryEntry) => (
                  <li
                    key={entry.id}
                    className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs leading-relaxed md:text-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
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
                    <p className="text-white/60">
                      {entry.source} • {(entry.size / 1024 / 1024).toFixed(2)} Mo •{" "}
                      {new Date(entry.timestamp).toLocaleTimeString("fr-FR")}
                    </p>
                    {entry.status === "confirmed" && entry.confirmedAt && (
                      <p className="text-xs text-white/70">
                        Confirmé via la base à {new Date(entry.confirmedAt).toLocaleTimeString("fr-FR")}
                      </p>
                    )}
                    {entry.message && <p className="text-red-200">{entry.message}</p>}
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

