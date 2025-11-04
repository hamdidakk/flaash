"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { ModelSelector } from "./model-selector"
import { AdvancedSettings } from "./advanced-settings"

export function ChatSettingsPanel() {
  const { t } = useLanguage()
  const [model, setModel] = useState("gpt-4o")
  const [temperature, setTemperature] = useState(0.7)
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful assistant that answers questions based on the provided documents. Always cite your sources.",
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
          <ModelSelector value={model} onChange={setModel} />
          <AdvancedSettings
            temperature={temperature}
            onTemperatureChange={setTemperature}
            systemPrompt={systemPrompt}
            onSystemPromptChange={setSystemPrompt}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
