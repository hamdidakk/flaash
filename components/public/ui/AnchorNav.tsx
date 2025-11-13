type Item = { href: string; label: string }

export function AnchorNav({ items, ariaLabel }: { items: Item[]; ariaLabel?: string }) {
  return (
    <nav className="public-anchor-nav" aria-label={ariaLabel}>
      {items.map((l) => (
        <a key={l.href} href={l.href} className="public-anchor-nav__link">
          {l.label}
        </a>
      ))}
    </nav>
  )
}


