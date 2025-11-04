"use client"

import type React from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps {
  id: string
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  required?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  helperText?: string
  error?: string
}

export function SelectField({
  id,
  label,
  placeholder,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  icon,
  helperText,
  error,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <Select value={value} onValueChange={onChange} required={required} disabled={disabled}>
        <SelectTrigger id={id} className={error ? "border-destructive" : ""}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helperText && <p className="text-sm text-muted-foreground">{helperText}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
