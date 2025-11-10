export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-6">
      <div className="flex size-8 items-center justify-center rounded-full bg-gray-200">🤖</div>
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
        <span className="inline-flex animate-pulse">…</span>
      </div>
    </div>
  )
}


