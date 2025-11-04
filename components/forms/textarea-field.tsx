"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface TextareaFieldProps {
  id: string
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
  rows?: number
  maxLength?: number
  icon?: React.ReactNode
  helperText?: string
  error?: string
}

export function TextareaField({
  id,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  icon,
  helperText,
  error,
}: TextareaFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={error ? "border-destructive" : ""}
      />
      {helperText && <p className="text-sm text-muted-foreground">{helperText}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
