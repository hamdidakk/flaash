"use client"
import { usePathname } from "next/navigation"
import {
  Home,
  FileText,
  Search,
  MessageSquare,
  BarChart3,
  Settings,
  Building2,
  Users,
  CreditCard,
  Gauge,
  Bell,
  Briefcase,
  Webhook,
  Shield,
  FileSearch,
  FolderOpen,
  Target,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { SidebarLogo } from "@/components/sidebar/sidebar-logo"
import { SidebarNavSection } from "@/components/sidebar/sidebar-nav-section"
import { SidebarUserInfo } from "@/components/sidebar/sidebar-user-info"

const navigation = [
  { name: "Dashboard", href: "/home", icon: Home },
  { name: "Documents", href: "/documents", icon: FileText },
  { name: "Search", href: "/search", icon: Search },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
]

const management = [
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Evaluation", href: "/evaluation", icon: Target },
  { name: "Organizations", href: "/organizations", icon: Building2 },
  { name: "Users", href: "/users", icon: Users },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Quotas", href: "/quotas", icon: Gauge },
]

const system = [
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "Jobs", href: "/jobs", icon: Briefcase },
  { name: "Webhooks", href: "/webhooks", icon: Webhook },
  { name: "Audit Logs", href: "/audit-logs", icon: FileSearch },
  { name: "Privacy", href: "/privacy", icon: Shield },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card shadow-sm">
      <SidebarLogo />

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          <SidebarNavSection title="Main" items={navigation} pathname={pathname} />
          <Separator className="bg-border/50" />
          <SidebarNavSection title="Management" items={management} pathname={pathname} />
          <Separator className="bg-border/50" />
          <SidebarNavSection title="System" items={system} pathname={pathname} />
        </div>
      </ScrollArea>

      {user && <SidebarUserInfo user={user} />}
    </div>
  )
}

export default DashboardSidebar
