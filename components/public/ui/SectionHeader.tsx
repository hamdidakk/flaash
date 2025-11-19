import type { ReactNode } from "react"

type SectionHeaderProps = {
  title: ReactNode
  icon?: ReactNode
  description?: ReactNode
  className?: string
  as?: "h2" | "h3"
}

export function SectionHeader({ title, icon, description, className, as = "h2" }: SectionHeaderProps) {
  const Tag = as
  const base = "public-section-header"
  const cls = className ? `${base} ${className}` : base
  return (
    <div className={cls}>
      <Tag>
        {icon ? (
          <>
            <span className="public-section-header__icon" aria-hidden>
              {icon}
            </span>
            {title}
          </>
        ) : (
          <>{title}</>
        )}
      </Tag>
      {description ? <p className="public-section-header__description">{description}</p> : null}
    </div>
  )
}


