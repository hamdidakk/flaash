export function ContactBadge({ email, label }: { email: string; label?: string }) {
  return (
    <a href={`mailto:${email}`} className="rounded bg-blue-50 px-2 py-0.5 font-medium text-blue-700 underline decoration-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2">
      {label ?? email}
    </a>
  )
}


