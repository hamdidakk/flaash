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
    <form
      className="border-t p-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSend()
      }}
      aria-label={t("chat.formAriaLabel")}
    >
      <div className="flex gap-2">
        <Input
          placeholder={t("chat.placeholder")}
          aria-label={t("chat.inputAriaLabel")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSend()}
          disabled={disabled}
        />
        <Button type="submit" aria-label={t("chat.sendAriaLabel")} onClick={onSend} disabled={disabled}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
