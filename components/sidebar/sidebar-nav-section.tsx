"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
}

interface SidebarNavSectionProps {
  title: string
  items: NavItem[]
}

export function SidebarNavSection({ title, items }: SidebarNavSectionProps) {
  const pathname = usePathname()

  return (
    <div>
      <h3 className="sidebar-section__title">{title}</h3>
      <nav className="sidebar-nav">
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "sidebar-link",
                isActive ? "sidebar-link--active" : "sidebar-link--inactive",
              )}
            >
              <item.icon className="sidebar-link__icon" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
