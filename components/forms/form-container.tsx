"use client"

import type React from "react"

interface FormContainerProps {
  onSubmit: (e: React.FormEvent) => void
  children: React.ReactNode
  className?: string
}

export function FormContainer({ onSubmit, children, className = "space-y-4" }: FormContainerProps) {
  return (
    <form onSubmit={onSubmit} className={className}>
      {children}
    </form>
  )
}
