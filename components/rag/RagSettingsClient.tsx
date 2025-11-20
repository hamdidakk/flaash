"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { DashboardFormSection, DashboardFormField, DashboardFormActions } from "@/components/dashboard/DashboardForm"

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
    <div className="rag-stack text-white">
      <div className="rag-card__header rag-card__header--start">
        <div>
          <h1 className="rag-page-heading">Paramètres RAG</h1>
          <p className="rag-page-subtitle">Configurez les paramètres par défaut pour vos conversations RAG.</p>
        </div>
        <div className="rag-card__actions">
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges} className="rag-button-ghost">
            <RotateCcw className="mr-2 size-4" />
            Réinitialiser
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges} className="dashboard-cta-accent">
            <Save className="mr-2 size-4" />
            Enregistrer
          </Button>
        </div>
      </div>

      {/* Modèle */}
      <Card className="rag-card">
        <div className="rag-toolbar rag-toolbar--start">
          <div className="rag-icon-badge rag-icon-badge--green">
            <Settings className="size-6" />
          </div>
          <div className="flex-1 rag-stack--dense">
            <div>
              <h2 className="text-xl font-semibold">Modèle de langage</h2>
              <p className="mt-1 text-sm text-white/70">
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
      <Card className="rag-card">
        <div className="rag-toolbar rag-toolbar--start">
          <div className="rag-icon-badge rag-icon-badge--blue">
            <Settings className="size-6" />
          </div>
          <div className="flex-1 rag-stack">
            <div>
              <h2 className="text-xl font-semibold">Paramètres avancés</h2>
              <p className="mt-1 text-sm text-white/70">
                Ajustez la créativité et le comportement du modèle.
              </p>
            </div>

            <DashboardFormSection columns={1}>
              <DashboardFormField
                label="Température"
                description="Une valeur basse (0.3-0.5) donne des réponses cohérentes, une valeur élevée favorise la créativité."
                hint={<span className="text-xs font-medium text-muted-foreground">{settings.temperature.toFixed(1)}</span>}
              >
                <Slider
                  value={[settings.temperature]}
                  onValueChange={(values) => setSettings((prev) => ({ ...prev, temperature: values[0] }))}
                  min={0}
                  max={2}
                  step={0.1}
                  className="slider-green"
                />
              </DashboardFormField>

              <DashboardFormField
                label="Prompt système"
                description="Définit le rôle et le comportement de l’assistant pour toutes les conversations."
              >
                <Textarea
                  value={settings.systemPrompt}
                  onChange={(e) => setSettings((prev) => ({ ...prev, systemPrompt: e.target.value }))}
                  placeholder="Définissez le comportement par défaut de l'assistant..."
                  rows={4}
                  className="font-mono text-sm"
                />
              </DashboardFormField>
            </DashboardFormSection>
          </div>
        </div>
      </Card>

      {/* Type de prompt et Collection */}
      <div className="rag-grid-2">
        <Card className="rag-card">
          <div className="rag-stack--dense">
            <div>
              <h3 className="font-semibold">Type de prompt</h3>
              <p className="mt-1 text-sm text-white/70">
                Choisissez le format de prompt utilisé pour les requêtes RAG.
              </p>
            </div>
            <DashboardFormSection columns={1}>
              <DashboardFormField label="Type de prompt">
                <Select value={settings.promptType} onValueChange={(value: RagPromptType) => setSettings((prev) => ({ ...prev, promptType: value }))}>
                  <SelectTrigger className="rag-select-trigger">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {promptTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-white/70">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DashboardFormField>
            </DashboardFormSection>
          </div>
        </Card>

        <Card className="rag-card">
          <div className="rag-stack--dense">
            <div>
              <h3 className="font-semibold">Collection par défaut</h3>
              <p className="mt-1 text-sm text-white/70">
                Sélectionnez la collection utilisée par défaut pour les recherches.
              </p>
            </div>
            <DashboardFormSection columns={1}>
              <DashboardFormField label="Collection par défaut">
                <Select value={settings.collectionId} onValueChange={(value) => setSettings((prev) => ({ ...prev, collectionId: value }))}>
                  <SelectTrigger className="rag-select-trigger">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {collectionOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        <div>
                          <div className="font-medium">{option.name}</div>
                          <div className="text-xs text-white/70">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DashboardFormField>
            </DashboardFormSection>
          </div>
        </Card>
      </div>

      {/* Info */}
      <Card className="rag-card border border-blue-500/30 bg-blue-500/10">
        <div className="rag-toolbar rag-toolbar--start">
          <div className="shrink-0">
            <Settings className="size-5 text-blue-300" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-white">Note importante</h4>
            <p className="mt-2 text-sm text-white/80">
              Ces paramètres sont utilisés comme valeurs par défaut pour toutes les nouvelles conversations. Vous
              pouvez toujours les modifier individuellement dans chaque conversation via le panneau de paramètres.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

