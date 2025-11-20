interface MetricBarProps {
  label: string
  value: string
  percentage: number
  color?: string
}

export function MetricBar({ label, value, percentage, color = "bg-blue-500" }: MetricBarProps) {
  return (
    <div className="dashboard-metric">
      <div className="dashboard-metric__header">
        <span className="dashboard-metric__label">{label}</span>
        <span className="dashboard-metric__value">{value}</span>
      </div>
      <div className="dashboard-metric__bar">
        <div className={`dashboard-metric__bar-fill ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
