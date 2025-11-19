"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Settings, Save, RotateCcw } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ModelSelector } from "@/components/chat/model-selector"
import type { RagPromptType } from "@/lib/types"
import {
  DEFAULT_RAG_SETTINGS,
  loadDefaultRagSettings,
  saveDefaultRagSettings,
  resetDefaultRagSettings,
  type RagSettings,
} from "@/lib/rag-settings"

export function RagSettingsClient() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<RagSettings>(DEFAULT_RAG_SETTINGS)
  const [hasChanges, setHasChanges] = useState(false)

  // Charger les paramètres depuis localStorage
  useEffect(() => {
    const loaded = loadDefaultRagSettings()
    setSettings(loaded)
  }, [])

  // Détecter les changements
  useEffect(() => {
    const loaded = loadDefaultRagSettings()
    setHasChanges(JSON.stringify(settings) !== JSON.stringify(loaded))
  }, [settings])

  const handleSave = () => {
    try {
      saveDefaultRagSettings(settings)
      setHasChanges(false)
      toast({
        title: "Paramètres enregistrés",
        description: "Vos paramètres par défaut ont été sauvegardés avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les paramètres. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const handleReset = () => {
    resetDefaultRagSettings()
    setSettings(DEFAULT_RAG_SETTINGS)
    setHasChanges(false)
    toast({
      title: "Paramètres réinitialisés",
      description: "Les paramètres par défaut ont été restaurés.",
    })
  }

  const promptTypeOptions: Array<{ value: RagPromptType; label: string; description: string }> = [
    {
      value: "short",
      label: "Court",
      description: "Prompt concis, idéal pour des réponses rapides et factuelles.",
    },
    {
      value: "long",
      label: "Long",
      description: "Prompt détaillé, meilleur pour des analyses approfondies.",
    },
    {
      value: "v2",
      label: "Version 2",
      description: "Version améliorée du prompt avec meilleure gestion du contexte.",
    },
  ]

  const collectionOptions = [
    {
      id: "all",
      name: "Toutes les collections",
      description: "Recherche dans tous les documents disponibles.",
    },
    {
      id: "document_collection",
      name: "Collection par défaut",
      description: "Collection principale pour les documents standards.",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres RAG</h1>
          <p className="mt-2 text-muted-foreground">
            Configurez les paramètres par défaut pour vos conversations RAG.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
            <RotateCcw className="mr-2 size-4" />
            Réinitialiser
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            className="bg-[var(--color-flaash-green)] text-white hover:bg-[var(--color-flaash-green-hover)]"
          >
            <Save className="mr-2 size-4" />
            Enregistrer
          </Button>
        </div>
      </div>

      {/* Modèle */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-[var(--color-flaash-green)]/10 p-3">
            <Settings className="size-6 text-[var(--color-flaash-green)]" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Modèle de langage</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Choisissez le modèle d'IA utilisé par défaut pour générer les réponses.
              </p>
            </div>
            <ModelSelector
              value={settings.model}
              onChange={(value) => setSettings((prev) => ({ ...prev, model: value }))}
            />
          </div>
        </div>
      </Card>

      {/* Température et Prompt système */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-blue-500/10 p-3">
            <Settings className="size-6 text-blue-500" />
          </div>
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Paramètres avancés</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ajustez la créativité et le comportement du modèle.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Température</Label>
                <span className="text-sm font-medium text-muted-foreground">{settings.temperature.toFixed(1)}</span>
              </div>
              <Slider
                value={[settings.temperature]}
                onValueChange={(values) => setSettings((prev) => ({ ...prev, temperature: values[0] }))}
                min={0}
                max={2}
                step={0.1}
                className="slider-green"
              />
              <p className="text-xs text-muted-foreground">
                Une valeur basse (0.3-0.5) donne des réponses plus factuelles et cohérentes. Une valeur élevée (0.7-1.0)
                favorise la créativité et la variété.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Prompt système</Label>
              <Textarea
                value={settings.systemPrompt}
                onChange={(e) => setSettings((prev) => ({ ...prev, systemPrompt: e.target.value }))}
                placeholder="Définissez le comportement par défaut de l'assistant..."
                rows={4}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Ce prompt définit le rôle et le comportement de l'assistant pour toutes les conversations.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Type de prompt et Collection */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Type de prompt</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Choisissez le format de prompt utilisé pour les requêtes RAG.
              </p>
            </div>
            <Select
              value={settings.promptType}
              onValueChange={(value: RagPromptType) => setSettings((prev) => ({ ...prev, promptType: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {promptTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Collection par défaut</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Sélectionnez la collection utilisée par défaut pour les recherches.
              </p>
            </div>
            <Select
              value={settings.collectionId}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, collectionId: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {collectionOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    <div>
                      <div className="font-medium">{option.name}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>
      </div>

      {/* Info */}
      <Card className="border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900 dark:bg-blue-950/20">
        <div className="flex gap-4">
          <div className="shrink-0">
            <Settings className="size-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-blue-900 dark:text-blue-100">Note importante</h4>
            <p className="mt-2 text-sm text-blue-800 dark:text-blue-200">
              Ces paramètres sont utilisés comme valeurs par défaut pour toutes les nouvelles conversations. Vous
              pouvez toujours les modifier individuellement dans chaque conversation via le panneau de paramètres.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

