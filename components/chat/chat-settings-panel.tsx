"use client"

import { useMemo } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { knowledgeCollections, type RagPromptType } from "@/lib/mock-data"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ModelSelector } from "./model-selector"
import { AdvancedSettings } from "./advanced-settings"

export interface ChatSettings {
  model: string
  temperature: number
  systemPrompt: string
  promptType: RagPromptType
  collectionId: string
}

interface ChatSettingsPanelProps {
  settings: ChatSettings
  onSettingsChange: (update: Partial<ChatSettings>) => void
}

export function ChatSettingsPanel({ settings, onSettingsChange }: ChatSettingsPanelProps) {
  const { t } = useLanguage()

  const collectionOptions = useMemo(
    () => [
      {
        id: "all",
        name: t("chat.collections.all"),
        description: t("chat.collections.allDescription"),
      },
      ...knowledgeCollections.map((collection) => ({
        id: collection.id,
        name: collection.name,
        description: collection.description,
      })),
    ],
    [t],
  )

  const promptTypeOptions: Array<{ value: RagPromptType; label: string; helper?: string }> = useMemo(
    () => [
      {
        value: "short",
        label: t("chat.settings.promptTypes.short"),
        helper: t("chat.settings.promptTypes.shortDescription"),
      },
      {
        value: "long",
        label: t("chat.settings.promptTypes.long"),
        helper: t("chat.settings.promptTypes.longDescription"),
      },
      {
        value: "v2",
        label: t("chat.settings.promptTypes.v2"),
        helper: t("chat.settings.promptTypes.v2Description"),
      },
    ],
    [t],
  )

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="mr-2 h-4 w-4" />
          {t("chat.settings.title")}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("chat.settings.title")}</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 py-6">
          <ModelSelector
            value={settings.model}
            onChange={(value) => onSettingsChange({ model: value })}
          />

          <div className="space-y-2">
            <Label>{t("chat.settings.collection")}</Label>
            <Select
              value={settings.collectionId}
              onValueChange={(value) => onSettingsChange({ collectionId: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {collectionOptions.map((collection) => (
                  <SelectItem key={collection.id} value={collection.id}>
                    <div className="flex flex-col text-left">
                      <span className="font-medium">{collection.name}</span>
                      <span className="text-xs text-muted-foreground">{collection.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{t("chat.settings.collectionDescription")}</p>
          </div>

          <div className="space-y-2">
            <Label>{t("chat.settings.promptType")}</Label>
            <Select
              value={settings.promptType}
              onValueChange={(value) => onSettingsChange({ promptType: value as RagPromptType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {promptTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col text-left">
                      <span className="font-medium">{option.label}</span>
                      {option.helper && (
                        <span className="text-xs text-muted-foreground">{option.helper}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{t("chat.settings.promptTypeDescription")}</p>
          </div>

          <AdvancedSettings
            temperature={settings.temperature}
            onTemperatureChange={(value) => onSettingsChange({ temperature: value })}
            systemPrompt={settings.systemPrompt}
            onSystemPromptChange={(value) => onSettingsChange({ systemPrompt: value })}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
