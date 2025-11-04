import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface SwitchFieldProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  helperText?: string
}

export function SwitchField({ id, label, checked, onChange, disabled = false, helperText }: SwitchFieldProps) {
  return (
    <div className="flex items-center justify-between space-x-2">
      <div className="space-y-0.5">
        <Label htmlFor={id}>{label}</Label>
        {helperText && <p className="text-sm text-muted-foreground">{helperText}</p>}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  )
}
