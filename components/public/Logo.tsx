import type { HTMLAttributes } from "react"

interface LogoProps extends HTMLAttributes<SVGSVGElement> {
  title?: string
}

export function Logo({ className, title = "FLAASH", ...rest }: LogoProps) {
  return (
    <svg
      viewBox="0 0 480 96"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={title}
      role="img"
      className={className}
      {...rest}
    >
      <title>{title}</title>
      {/* Wordmark based on system font; fill uses currentColor for easy theming */}
      <text
        x="0"
        y="68"
        fontSize="64"
        fontWeight="700"
        letterSpacing="4"
        fontFamily="'Space Grotesk', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fill="currentColor"
      >
        FLAASH
      </text>
    </svg>
  )
}


