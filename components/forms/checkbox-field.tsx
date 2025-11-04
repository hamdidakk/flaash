import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface CheckboxFieldProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  helperText?: string
  error?: string
}

export function CheckboxField({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  helperText,
  error,
}: CheckboxFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Checkbox id={id} checked={checked} onCheckedChange={onChange} disabled={disabled} />
        <Label htmlFor={id} className="cursor-pointer">
          {label}
        </Label>
      </div>
      {helperText && <p className="text-sm text-muted-foreground">{helperText}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
