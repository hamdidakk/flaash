export function Ticker({ items, ariaLabel }: { items: string[]; ariaLabel?: string }) {
  const doubled = [...items, ...items]
  return (
    <section aria-label={ariaLabel ?? "Exemples"} className="public-ticker">
      <div className="public-ticker__inner">
        <div className="public-ticker__scroller">
          <div className="public-ticker__track">
            {doubled.map((q, i) => (
              <span key={`${q}-${i}`} className="public-ticker__item">
                <span className="public-ticker__icon">✦</span>
                {q}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


