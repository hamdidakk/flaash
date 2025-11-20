import { createContext, useContext, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type DashboardFormTone = "default" | "dark"

const toneStyles: Record<DashboardFormTone, { title: string; description: string; label: string }> = {
  default: {
    title: "text-muted-foreground",
    description: "text-muted-foreground",
    label: "text-foreground",
  },
  dark: {
    title: "text-white/70",
    description: "text-white/60",
    label: "text-white",
  },
}

const DashboardFormToneContext = createContext<DashboardFormTone>("default")

type SectionColumns = 1 | 2 | 3 | 4 | "none"

interface DashboardFormSectionProps {
  title?: ReactNode
  description?: ReactNode
  actions?: ReactNode
  columns?: SectionColumns
  className?: string
  contentClassName?: string
  dense?: boolean
  divider?: boolean
  tone?: DashboardFormTone
  children: ReactNode
}

export function DashboardFormSection({
  title,
  description,
  actions,
  columns = 1,
  className,
  contentClassName,
  dense = false,
  divider = false,
  tone = "default",
  children,
}: DashboardFormSectionProps) {
  const hasHeader = title || description || actions
  const contentWrapperClass =
    columns === "none"
      ? dense
        ? "dashboard-form-stack--dense"
        : "dashboard-form-stack"
      : cn(
          "dashboard-form-section",
          dense && "gap-3",
          columns === 1 && "dashboard-form-section--grid-1",
          columns === 2 && "dashboard-form-section--grid-2",
          columns === 3 && "dashboard-form-section--grid-3",
          columns === 4 && "dashboard-form-section--grid-4",
        )

  return (
    <section
      className={cn(
        "dashboard-form-section",
        dense && "dashboard-form-section--dense",
        divider && "dashboard-form-section--divider",
        className,
      )}
    >
      {hasHeader ? (
        <div className="dashboard-form-section__header">
          <div className="dashboard-form-section__meta">
            {title ? (
              <h3 className={cn("dashboard-form-section__title", toneStyles[tone].title)}>{title}</h3>
            ) : null}
            {description
              ? typeof description === "string"
                ? (
                    <p className={cn("dashboard-form-section__description", toneStyles[tone].description)}>
                      {description}
                    </p>
                  )
                : (
                    <div className={cn("dashboard-form-section__description", toneStyles[tone].description)}>
                      {description}
                    </div>
                  )
              : null}
          </div>
          {actions ? <div className="dashboard-form-section__actions">{actions}</div> : null}
        </div>
      ) : null}

      <DashboardFormToneContext.Provider value={tone}>
        <div className={cn(contentWrapperClass, contentClassName)}>{children}</div>
      </DashboardFormToneContext.Provider>
    </section>
  )
}

interface DashboardFormFieldProps {
  label: ReactNode
  description?: ReactNode
  hint?: ReactNode
  required?: boolean
  htmlFor?: string
  tone?: DashboardFormTone
  className?: string
  labelClassName?: string
  children: ReactNode
}

export function DashboardFormField({
  label,
  description,
  hint,
  required = false,
  htmlFor,
  tone,
  className,
  labelClassName,
  children,
}: DashboardFormFieldProps) {
  const inheritedTone = useContext(DashboardFormToneContext)
  const effectiveTone = tone ?? inheritedTone

  return (
    <div className={cn("dashboard-form-field", className)}>
      <div className="dashboard-form-field__header">
        <label
          htmlFor={htmlFor}
          className={cn("dashboard-form-field__label", toneStyles[effectiveTone].label, labelClassName)}
        >
          {label}
          {required ? <span className="ml-1 text-destructive">*</span> : null}
        </label>
        {hint}
      </div>
      {description
        ? typeof description === "string"
          ? (
              <p className={cn("dashboard-form-field__description", toneStyles[effectiveTone].description)}>{description}</p>
            )
          : (
              <div className={cn("dashboard-form-field__description", toneStyles[effectiveTone].description)}>{description}</div>
            )
        : null}
      {children}
    </div>
  )
}

interface DashboardFormActionsProps {
  align?: "left" | "center" | "right" | "space-between"
  className?: string
  children: ReactNode
}

export function DashboardFormActions({ align = "right", className, children }: DashboardFormActionsProps) {
  const alignClass =
    align === "left"
      ? "justify-start"
      : align === "center"
        ? "justify-center"
        : align === "space-between"
          ? "justify-between"
          : "justify-end"

  return (
    <div className={cn("dashboard-form-actions", alignClass, className)}>
      {children}
    </div>
  )
}

