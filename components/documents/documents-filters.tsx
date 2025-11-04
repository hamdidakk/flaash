"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface DocumentsFiltersProps {
  statusFilter: string
  dateFrom: string
  dateTo: string
  onStatusChange: (status: string) => void
  onDateFromChange: (date: string) => void
  onDateToChange: (date: string) => void
  onClearFilters: () => void
}

export function DocumentsFilters({
  statusFilter,
  dateFrom,
  dateTo,
  onStatusChange,
  onDateFromChange,
  onDateToChange,
  onClearFilters,
}: DocumentsFiltersProps) {
  const { t } = useLanguage()

  const hasActiveFilters = statusFilter !== "all" || dateFrom || dateTo

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px] space-y-2">
          <Label>{t("documents.table.status")}</Label>
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("documents.filters.all")}</SelectItem>
              <SelectItem value="completed">{t("documents.filters.completed")}</SelectItem>
              <SelectItem value="processing">{t("documents.filters.processing")}</SelectItem>
              <SelectItem value="failed">{t("documents.filters.failed")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[200px] space-y-2">
          <Label>{t("documents.filters.dateFrom")}</Label>
          <Input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} />
        </div>

        <div className="flex-1 min-w-[200px] space-y-2">
          <Label>{t("documents.filters.dateTo")}</Label>
          <Input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} />
        </div>

        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearFilters} className="gap-2 bg-transparent">
            <X className="h-4 w-4" />
            {t("documents.filters.clearFilters")}
          </Button>
        )}
      </div>
    </Card>
  )
}
