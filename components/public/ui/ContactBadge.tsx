export function ContactBadge({ email, label }: { email: string; label?: string }) {
  return (
    <a href={`mailto:${email}`} className="public-contact-badge">
      {label ?? email}
    </a>
  )
}


