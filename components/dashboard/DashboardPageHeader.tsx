import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface DashboardPageHeaderProps {
  title: string
  description?: ReactNode
  eyebrow?: ReactNode
  meta?: ReactNode
  actions?: ReactNode
  align?: "left" | "center"
  spacing?: "default" | "compact"
  divider?: boolean
  className?: string
  children?: ReactNode
}

export function DashboardPageHeader({
  title,
  description,
  eyebrow,
  meta,
  actions,
  align = "left",
  spacing = "default",
  divider = false,
  className,
  children,
}: DashboardPageHeaderProps) {
  return (
    <header
      className={cn(
        "dashboard-page-header",
        spacing === "compact" && "dashboard-page-header--compact",
        divider && "pb-6 md:pb-8 border-b",
        className,
      )}
    >
      <div
        className={cn(
          "dashboard-page-header__inner",
          align === "center" ? "dashboard-page-header__inner--center" : "dashboard-page-header__inner--left",
        )}
      >
        <div className={cn("flex-1 space-y-1", align === "center" && "md:flex-none")}>
          {eyebrow ? (
            <div className="dashboard-eyebrow">{eyebrow}</div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="dashboard-heading">{title}</h1>
            {meta}
          </div>

          {description
            ? typeof description === "string"
              ? (
                  <p className="text-muted-foreground">{description}</p>
                )
              : (
                  <div className="text-muted-foreground">{description}</div>
                )
            : null}
        </div>

        {actions ? (
          <div className={cn("flex flex-wrap gap-2", align === "center" && "md:justify-center")}>{actions}</div>
        ) : null}
      </div>

      {children ? <div className="pt-2">{children}</div> : null}
    </header>
  )
}

