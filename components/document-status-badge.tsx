import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, XCircle } from "lucide-react"

interface DocumentStatusBadgeProps {
  status: "completed" | "processing" | "pending" | "failed"
}

export function DocumentStatusBadge({ status }: DocumentStatusBadgeProps) {
  const statusConfig = {
    completed: {
      label: "Completed",
      variant: "default" as const,
      icon: CheckCircle2,
      className: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    },
    processing: {
      label: "Processing",
      variant: "secondary" as const,
      icon: Clock,
      className: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    },
    pending: {
      label: "Pending",
      variant: "outline" as const,
      icon: Clock,
      className: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    },
    failed: {
      label: "Failed",
      variant: "destructive" as const,
      icon: XCircle,
      className: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
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
