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
  const { t, language } = useLanguage()

  return (
    <form
      className="sticky bottom-0 border-t bg-white/90 p-4 backdrop-blur supports-[backdrop-filter]:bg-white/70"
      onSubmit={(e) => {
        e.preventDefault()
        onSend()
      }}
      aria-label={t("chat.formAriaLabel")}
    >
      <div className="flex gap-2">
        <Input
          placeholder={
            language === "fr"
              ? "Posez une question sur un article, un thème ou une citation FLAASH…"
              : "Ask about an article, a theme or a FLAASH citation…"
          }
          aria-label={t("chat.inputAriaLabel")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSend()}
          disabled={disabled}
          className="h-11 rounded-xl px-4 py-3 text-sm"
        />
        <Button
          type="submit"
          variant="ghost"
          aria-label={t("chat.sendAriaLabel")}
          onClick={onSend}
          disabled={disabled}
          className="size-11 shrink-0 rounded-full border-0 bg-[var(--color-flaash-green)] p-0 text-white transition hover:scale-105 hover:bg-[var(--color-flaash-green-hover)] focus-visible:ring-[var(--color-flaash-green)] focus-visible:ring-offset-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
