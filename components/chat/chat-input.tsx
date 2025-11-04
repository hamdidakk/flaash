"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  disabled?: boolean
}

export function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  const { t } = useLanguage()

  return (
    <div className="border-t p-4">
      <div className="flex gap-2">
        <Input
          placeholder={t("chat.placeholder")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSend()}
          disabled={disabled}
        />
        <Button onClick={onSend} disabled={disabled}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
