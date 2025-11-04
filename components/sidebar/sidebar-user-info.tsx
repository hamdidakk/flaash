"use client"

import { useAuth } from "@/lib/auth-context"

export function SidebarUserInfo() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="border-t bg-muted/30 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-sm font-semibold text-primary-foreground shadow-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
    </div>
  )
}
