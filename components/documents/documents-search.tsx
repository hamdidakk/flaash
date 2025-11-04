"use client"

import { Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/language-context"

interface DocumentsSearchProps {
  value: string
  onChange: (value: string) => void
}

export function DocumentsSearch({ value, onChange }: DocumentsSearchProps) {
  const { t } = useLanguage()

  return (
    <Card className="p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("documents.search")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </Card>
  )
}
