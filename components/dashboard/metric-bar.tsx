interface MetricBarProps {
  label: string
  value: string
  percentage: number
  color?: string
}

export function MetricBar({ label, value, percentage, color = "bg-blue-500" }: MetricBarProps) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span>{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
