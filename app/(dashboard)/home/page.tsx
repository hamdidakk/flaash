"use client"

import { PageHeader } from "@/components/page-header"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { QuickActionsSection } from "@/components/dashboard/quick-actions-section"
import { RecentActivitySection } from "@/components/dashboard/recent-activity-section"
import { CostManagementCard } from "@/components/dashboard/cost-management-card"
import { FileText, MessageSquare, Search, TrendingUp, Upload, Settings } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import {
  knowledgeDocuments,
  knowledgeChunksByDocument,
  semanticSearchResults,
  usageCostSnapshot,
} from "@/lib/mock-data"

export default function HomePage() {
  const { t } = useLanguage()

  const totalDocuments = knowledgeDocuments.length
  const totalChunks = Object.values(knowledgeChunksByDocument).reduce((acc, chunks) => acc + chunks.length, 0)
  const totalSearches = semanticSearchResults.length * 12
  const totalConversations = Math.round(usageCostSnapshot.tokensUsed / 5500)
  const costData = usageCostSnapshot

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload":
        return Upload
      case "chat":
        return MessageSquare
      case "search":
        return Search
      default:
        return FileText
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 60) {
      return `${diffMins}${t("dashboard.time.minutesAgo")}`
    }
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) {
      return `${diffHours}${t("dashboard.time.hoursAgo")}`
    }
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}${t("dashboard.time.daysAgo")}`
  }

  const recentActivity = [
    {
      id: "activity-upload",
      type: "upload" as const,
      title: t("dashboard.activity.documentUploaded"),
      description: knowledgeDocuments[0]?.name ?? "",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "activity-chat",
      type: "chat" as const,
      title: t("dashboard.activity.newConversation"),
      description:
        semanticSearchResults[0]?.snippet ? `${semanticSearchResults[0].snippet.slice(0, 64)}…` : t("dashboard.activity.chatFallback"),
      timestamp: new Date(Date.now() - 1000 * 60 * 14),
    },
    {
      id: "activity-search",
      type: "search" as const,
      title: t("dashboard.activity.searchPerformed"),
      description: `${t("dashboard.activity.query")}: "${semanticSearchResults[1]?.document ?? "product latency"}"`,
      timestamp: new Date(Date.now() - 1000 * 60 * 28),
    },
  ]

  const statsData = [
    {
      title: t("dashboard.stats.documents"),
      value: totalDocuments,
      icon: FileText,
      trend: { value: 12, isPositive: true },
    },
    {
      title: t("dashboard.stats.chunks"),
      value: totalChunks,
      icon: TrendingUp,
      trend: { value: 8, isPositive: true },
    },
    {
      title: t("dashboard.stats.conversations"),
      value: totalConversations,
      icon: MessageSquare,
      trend: { value: 5, isPositive: true },
    },
    {
      title: t("dashboard.stats.searches"),
      value: totalSearches,
      icon: Search,
      trend: { value: 15, isPositive: true },
    },
  ]

  const quickActions = [
    {
      title: t("dashboard.actions.uploadDocument"),
      description: t("dashboard.actions.uploadDescription"),
      icon: Upload,
      href: "/documents",
    },
    {
      title: t("dashboard.actions.startChat"),
      description: t("dashboard.actions.chatDescription"),
      icon: MessageSquare,
      href: "/chat",
    },
    {
      title: t("dashboard.actions.search"),
      description: t("dashboard.actions.searchDescription"),
      icon: Search,
      href: "/search",
    },
    {
      title: t("dashboard.actions.settings"),
      description: t("dashboard.actions.settingsDescription"),
      icon: Settings,
      href: "/settings",
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t("dashboard.title")} description={t("dashboard.description")} />

      <StatsGrid stats={statsData} />

      <CostManagementCard data={costData} />

      <div className="grid gap-6 lg:grid-cols-2">
        <QuickActionsSection
          title={t("dashboard.quickActions")}
          description={t("dashboard.quickActionsDescription")}
          actions={quickActions}
        />

        <RecentActivitySection
          title={t("dashboard.recentActivity")}
          description={t("dashboard.recentActivityDescription")}
          activities={recentActivity}
          getIcon={getActivityIcon}
          formatTime={formatTime}
        />
      </div>
    </div>
  )
}
