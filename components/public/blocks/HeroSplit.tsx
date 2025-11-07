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
  const root = className ? `relative ${className}` : "relative"
  const grid = containerClassName
    ? `mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 md:items-center ${containerClassName}`
    : "mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-2 md:items-center"

  return (
    <section className={root} {...rest}>
      <div className={grid}>
        <div className={leftClassName ?? "fade-in-up"}>
          <h1 className="display-title text-3xl tracking-tight md:text-4xl">{heading}</h1>
          {subtitle ? <p className="mt-3 text-gray-600">{subtitle}</p> : null}
          {(primaryCta || secondaryCta) && (
            <div className="mt-6 flex gap-4">
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


