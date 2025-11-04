"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/lib/language-context"

interface AdvancedSettingsProps {
  temperature: number
  onTemperatureChange: (value: number) => void
  systemPrompt: string
  onSystemPromptChange: (value: string) => void
}

export function AdvancedSettings({
  temperature,
  onTemperatureChange,
  systemPrompt,
  onSystemPromptChange,
}: AdvancedSettingsProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>{t("chat.settings.temperature")}</Label>
          <span className="text-sm text-muted-foreground">{temperature.toFixed(1)}</span>
        </div>
        <Slider
          value={[temperature]}
          onValueChange={(values) => onTemperatureChange(values[0])}
          min={0}
          max={2}
          step={0.1}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">{t("chat.settings.temperatureDescription")}</p>
      </div>

      <div className="space-y-2">
        <Label>{t("chat.settings.systemPrompt")}</Label>
        <Textarea
          value={systemPrompt}
          onChange={(e) => onSystemPromptChange(e.target.value)}
          placeholder={t("chat.settings.systemPromptPlaceholder")}
          rows={4}
        />
        <p className="text-xs text-muted-foreground">{t("chat.settings.systemPromptDescription")}</p>
      </div>
    </div>
  )
}
