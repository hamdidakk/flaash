"use client"

type SidebarUser = {
  name?: string
  email?: string
}

export function SidebarUserInfo({ user }: { user?: SidebarUser }) {
  if (!user) return null

  const displayName = (user.name && user.name.trim()) || user.email || ""
  const initial = (displayName.charAt(0) || "?").toUpperCase()

  return (
    <div className="border-t bg-muted/30 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-sm font-semibold text-primary-foreground shadow-sm">
          {initial}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-sm font-semibold">{displayName || ""}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email || ""}</p>
        </div>
      </div>
    </div>
  )
}
