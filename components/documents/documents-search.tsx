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
    <Card className="dashboard-search-card">
      <div className="dashboard-search">
        <Search className="dashboard-search__icon" />
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
