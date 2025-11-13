export type FAQItem = { q: string; a: string }

export function FAQAccordion({ items, footerText }: { items: FAQItem[]; footerText?: string }) {
  return (
    <div>
      <div className="public-faq">
        {items.map((f) => (
          <details key={f.q} className="public-faq__item group">
            <summary className="public-faq__summary">
              <span>{f.q}</span>
              <svg className="public-faq__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
              </svg>
            </summary>
            <p className="public-faq__answer">{f.a}</p>
          </details>
        ))}
      </div>
      {footerText ? <p className="public-faq__footer">{footerText}</p> : null}
    </div>
  )
}


