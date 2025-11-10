import Link from "next/link"
import { SectionCard } from "@/components/public/ui/SectionCard"
import { SectionHeader } from "@/components/public/ui/SectionHeader"

type BubbleItem = {
  label: string
  href: string
  icon?: string
  tooltip?: string
}

export function BubbleGrid({
  title,
  intro,
  items,
  cta,
  tone = "blue",
}: {
  title: string
  intro?: string
  items: BubbleItem[]
  cta?: { href: string; label: string }
  tone?: "blue" | "gray"
}) {
  const toneClasses =
    tone === "blue"
      ? "border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100"
      : "border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100"

  return (
    <SectionCard>
      <SectionHeader title={title} />
      {intro ? <p className="mt-2 text-sm text-gray-600">{intro}</p> : null}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            title={it.tooltip}
            className={`group relative mx-auto flex h-[80px] w-full max-w-[260px] min-w-[200px] cursor-pointer items-center justify-center rounded-full border px-4 text-center text-sm leading-tight transition ${toneClasses} whitespace-normal`}
          >
            <span className="flex flex-col items-center justify-center gap-0.5">
              {it.icon ? <span aria-hidden className="select-none">{it.icon}</span> : null}
              <span className="block max-w-full break-words">{it.label}</span>
            </span>
            {it.tooltip ? (
              <span
                className="pointer-events-none absolute left-[calc(100%+1.5rem)] z-10 inline-block max-w-[240px] rounded-md border border-gray-200 bg-white/95 px-3 py-2 text-left text-xs text-gray-800 opacity-0 shadow-md ring-1 ring-black/5 transition duration-150 ease-out origin-left scale-0 group-hover:opacity-100 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:scale-100"
              >
                {it.tooltip}
              </span>
            ) : null}
          </Link>
        ))}
      </div>
      {cta ? (
        <div className="mt-3">
          <Link href={cta.href} className="text-sm font-medium text-gray-700 underline underline-offset-4">
            {cta.label}
          </Link>
        </div>
      ) : null}
    </SectionCard>
  )
}


