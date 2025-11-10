export function WidgetHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-6 pt-6">
      <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-gray-800">
        <span aria-hidden>🤖</span> {title}
      </h2>
      {subtitle ? <p className="mb-4 text-sm text-gray-600">{subtitle}</p> : null}
    </div>
  )
}


