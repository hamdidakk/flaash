"use client"

import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/header/theme-toggle"
import { UserMenu } from "@/components/header/user-menu"

export function DashboardHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}

export default DashboardHeader
