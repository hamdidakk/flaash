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
    <div className="sidebar-user">
      <div className="sidebar-user__body">
        <div className="sidebar-user__avatar">{initial}</div>
        <div className="sidebar-user__info">
          <p className="sidebar-user__name">{displayName || ""}</p>
          <p className="sidebar-user__email">{user.email || ""}</p>
        </div>
      </div>
    </div>
  )
}
