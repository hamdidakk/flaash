type Item = { href: string; label: string }

export function AnchorNav({ items, ariaLabel }: { items: Item[]; ariaLabel?: string }) {
  return (
    <nav className="mt-6 flex flex-nowrap gap-2 overflow-x-auto text-sm" aria-label={ariaLabel}>
      {items.map((l) => (
        <a key={l.href} href={l.href} className="rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2">
          {l.label}
        </a>
      ))}
    </nav>
  )
}


