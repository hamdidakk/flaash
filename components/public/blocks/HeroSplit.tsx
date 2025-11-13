import type { ReactNode, HTMLAttributes } from "react"

type HeroSplitProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  heading: ReactNode
  subtitle?: ReactNode
  primaryCta?: ReactNode
  secondaryCta?: ReactNode
  right: ReactNode
  leftClassName?: string
  rightClassName?: string
  containerClassName?: string
}

export function HeroSplit({
  heading,
  subtitle,
  primaryCta,
  secondaryCta,
  right,
  leftClassName,
  rightClassName,
  containerClassName,
  className,
  ...rest
}: HeroSplitProps) {
  const root = className ? `public-hero ${className}` : "public-hero"
  const grid = containerClassName
    ? `public-hero__container ${containerClassName}`
    : "public-hero__container"

  return (
    <section className={root} {...rest}>
      <div className={grid}>
        <div className={leftClassName ?? "public-hero__left"}>
          <h1 className="public-hero__heading">{heading}</h1>
          {subtitle ? <p className="public-hero__subtitle">{subtitle}</p> : null}
          {(primaryCta || secondaryCta) && (
            <div className="public-hero__actions">
              {primaryCta}
              {secondaryCta}
            </div>
          )}
        </div>
        <div className={rightClassName}>{right}</div>
      </div>
    </section>
  )
}


