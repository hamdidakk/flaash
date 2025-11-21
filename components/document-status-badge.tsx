import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, XCircle } from "lucide-react"

interface DocumentStatusBadgeProps {
  status: "completed" | "processing" | "pending" | "failed"
}

export function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  const statusConfig = {
    completed: {
      label: "Terminé",
      variant: "default" as const,
      icon: CheckCircle2,
      className: "rag-status rag-status--success",
    },
    processing: {
      label: "En cours",
      variant: "secondary" as const,
      icon: Clock,
      className: "rag-status rag-status--info",
    },
    pending: {
      label: "En attente",
      variant: "outline" as const,
      icon: Clock,
      className: "rag-status rag-status--warning",
    },
    failed: {
      label: "Échec",
      variant: "destructive" as const,
      icon: XCircle,
      className: "rag-status rag-status--danger",
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}
