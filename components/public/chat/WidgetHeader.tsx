export function WidgetHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="public-widget-header">
      <h2 className="public-widget-header__title">
        <span aria-hidden className="public-widget-header__icon">🤖</span> {title}
      </h2>
      {subtitle ? <p className="public-widget-header__subtitle">{subtitle}</p> : null}
    </div>
  )
}


