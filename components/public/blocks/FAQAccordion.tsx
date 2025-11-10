export type FAQItem = { q: string; a: string }

export function FAQAccordion({ items, footerText }: { items: FAQItem[]; footerText?: string }) {
  return (
    <div>
      <div className="mt-2 space-y-3 text-gray-700">
        {items.map((f) => (
          <details key={f.q} className="group rounded-lg border border-gray-200 p-3">
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-gray-800">
              <span>{f.q}</span>
              <svg className="chev h-4 w-4 text-gray-500 transition-transform" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
              </svg>
            </summary>
            <p className="mt-2 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
      {footerText ? <p className="mt-3 text-sm text-gray-600">{footerText}</p> : null}
    </div>
  )
}


