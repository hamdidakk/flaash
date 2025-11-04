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
import { useLanguage } from "@/lib/language-context"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { SidebarLogo } from "@/components/sidebar/sidebar-logo"
import { SidebarNavSection } from "@/components/sidebar/sidebar-nav-section"
import { SidebarUserInfo } from "@/components/sidebar/sidebar-user-info"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { t } = useLanguage()

  const navigation = [
    { name: t("nav.dashboard"), href: "/home", icon: Home },
    { name: t("nav.documents"), href: "/documents", icon: FileText },
    { name: t("nav.search"), href: "/search", icon: Search },
    { name: t("nav.chat"), href: "/chat", icon: MessageSquare },
    { name: t("nav.analytics"), href: "/analytics", icon: BarChart3 },
  ]

  const management = [
    { name: t("nav.projects"), href: "/projects", icon: FolderOpen },
    { name: t("nav.evaluation"), href: "/evaluation", icon: Target },
    { name: t("nav.organizations"), href: "/organizations", icon: Building2 },
    { name: t("nav.users"), href: "/users", icon: Users },
    { name: t("nav.billing"), href: "/billing", icon: CreditCard },
    { name: t("nav.quotas"), href: "/quotas", icon: Gauge },
  ]

  const system = [
    { name: t("nav.alerts"), href: "/alerts", icon: Bell },
    { name: t("nav.jobs"), href: "/jobs", icon: Briefcase },
    { name: t("nav.webhooks"), href: "/webhooks", icon: Webhook },
    { name: t("nav.auditLogs"), href: "/audit-logs", icon: FileSearch },
    { name: t("nav.privacy"), href: "/privacy", icon: Shield },
    { name: t("nav.settings"), href: "/settings", icon: Settings },
  ]

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card shadow-sm">
      <SidebarLogo />

      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-6">
          <SidebarNavSection title={t("nav.main")} items={navigation} pathname={pathname} />
          <Separator className="bg-border/50" />
          <SidebarNavSection title={t("nav.management")} items={management} pathname={pathname} />
          <Separator className="bg-border/50" />
          <SidebarNavSection title={t("nav.system")} items={system} pathname={pathname} />
        </div>
      </ScrollArea>

      {user && <SidebarUserInfo user={user} />}
    </div>
  )
}

export default DashboardSidebar
