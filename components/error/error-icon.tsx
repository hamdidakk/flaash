import { AlertCircle } from "lucide-react"

interface ErrorIconProps {
  size?: "sm" | "md" | "lg"
}

export function ErrorIcon({ size = "md" }: ErrorIconProps) {
  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-20 w-20",
  }

  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  }

  return (
    <div
      className={`mx-auto mb-4 flex ${sizeClasses[size]} items-center justify-center rounded-full bg-destructive/10`}
    >
      <AlertCircle className={`${iconSizes[size]} text-destructive`} />
    </div>
  )
}
