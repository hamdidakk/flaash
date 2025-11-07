import type { ReactNode } from "react"

export type TimelineItem = { label: string; description: string; icon?: ReactNode }

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative mt-6 overflow-x-auto">
      <ol className="relative mx-auto flex min-w-[560px] items-start gap-8 border-l-2 border-cyan-200 pl-6 md:min-w-0 md:border-l-0 md:pl-0 md:[&>li]:flex-1 md:[&>li]:border-t-2 md:[&>li]:border-cyan-200 md:[&>li]:pt-4">
        {items.map((it, idx) => (
          <li key={idx} className="md:pl-4">
            <div className="text-sm font-semibold text-slate-800">{it.label} {it.icon}</div>
            <p className="text-sm text-gray-700">{it.description}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}


