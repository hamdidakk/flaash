import { cn } from "@/lib/utils"

interface FlaashWordmarkProps {
  className?: string
}

export function FlaashWordmark({ className }: FlaashWordmarkProps) {
  return (
    <span className={cn("flaash-wordmark", className)}>
      FLA
      <span aria-hidden className="flaash-wordmark__double-a">A</span>
      SH
    </span>
  )
}


