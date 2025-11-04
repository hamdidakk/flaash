"use client"

import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorActionButtonProps {
  label: string
  icon: LucideIcon
  onClick: () => void
}

export function ErrorActionButton({ label, icon: Icon, onClick }: ErrorActionButtonProps) {
  return (
    <Button onClick={onClick} className="gap-2">
      <Icon className="h-6 w-6" />
      {label}
    </Button>
  )
}
