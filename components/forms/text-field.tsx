"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface TextFieldProps {
  id: string
  label: string
  type?: "text" | "email" | "password" | "number" | "tel" | "url"
  placeholder?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
  minLength?: number
  maxLength?: number
  pattern?: string
  icon?: React.ReactNode
  helperText?: React.ReactNode
  error?: string
}

export function TextField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  minLength,
  maxLength,
  pattern,
  icon,
  helperText,
  error,
}: TextFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="flex items-center gap-2">
          {icon}
          {label}
        </Label>
        {helperText}
      </div>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
