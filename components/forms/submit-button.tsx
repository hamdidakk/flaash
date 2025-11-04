import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SubmitButtonProps {
  label: string
  loadingLabel?: string
  isLoading?: boolean
  disabled?: boolean
  icon?: LucideIcon
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  fullWidth?: boolean
}

export function SubmitButton({
  label,
  loadingLabel,
  isLoading = false,
  disabled = false,
  icon: Icon,
  variant = "default",
  fullWidth = false,
}: SubmitButtonProps) {
  return (
    <Button type="submit" variant={variant} disabled={isLoading || disabled} className={fullWidth ? "w-full" : ""}>
      {Icon && !isLoading && <Icon className="mr-2 h-4 w-4" />}
      {isLoading ? loadingLabel || label : label}
    </Button>
  )
}
