import type React from "react"

interface FormActionsProps {
  children: React.ReactNode
  align?: "left" | "center" | "right" | "between"
}

export function FormActions({ children, align = "right" }: FormActionsProps) {
  const alignClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between",
  }

  return <div className={`flex gap-2 pt-4 ${alignClasses[align]}`}>{children}</div>
}
