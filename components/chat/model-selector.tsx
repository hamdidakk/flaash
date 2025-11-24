"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/lib/language-context"

interface ModelSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const { t } = useLanguage()

  const models = [
    { value: "auto", label: "Auto (Mistral)", description: t("chat.models.auto") },
    { value: "gpt-4o", label: "GPT-4o", description: t("chat.models.gpt4o") },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo", description: t("chat.models.gpt4turbo") },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", description: t("chat.models.gpt35") },
    { value: "mistral-large", label: "Mistral Large", description: t("chat.models.mistralLarge") },
    { value: "mistral-medium", label: "Mistral Medium", description: t("chat.models.mistralMedium") },
  ]

  const selectedValue = models.some((model) => model.value === value) ? value : "auto"

  return (
    <div className="space-y-2">
      <Label>{t("chat.settings.model")}</Label>
      <Select value={selectedValue} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.value} value={model.value}>
              <div>
                <div className="font-medium">{model.label}</div>
                <div className="text-xs text-muted-foreground">{model.description}</div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
