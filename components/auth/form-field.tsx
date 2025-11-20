"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface FormFieldProps {
  id: string
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
  minLength?: number
  icon?: React.ReactNode
  helperText?: React.ReactNode
}

export function FormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  minLength,
  icon,
  helperText,
}: FormFieldProps) {
  return (
    <div className="form-field">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="form-field__label">
          {icon}
          {label}
        </Label>
        {helperText ? <span className="form-field__helper">{helperText}</span> : null}
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
      />
    </div>
  )
}
