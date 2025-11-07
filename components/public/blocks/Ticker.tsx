export function Ticker({ items, ariaLabel }: { items: string[]; ariaLabel?: string }) {
  const doubled = [...items, ...items]
  return (
    <section aria-label={ariaLabel ?? "Exemples"} className="relative border-y border-gray-100 bg-white/60">
      <div className="ticker mx-auto max-w-6xl overflow-hidden px-4 py-3">
        <div className="ticker__track inline-block whitespace-nowrap">
          {doubled.map((q, i) => (
            <span key={`${q}-${i}`} className="mr-8 inline-flex items-center text-sm text-gray-700">
              <span className="mr-2 text-gray-400">✦</span>
              {q}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}


