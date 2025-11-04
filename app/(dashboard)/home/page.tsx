"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { QuickActionsSection } from "@/components/dashboard/quick-actions-section"
import { RecentActivitySection } from "@/components/dashboard/recent-activity-section"
import { FileText, MessageSquare, Search, TrendingUp, Upload, Settings } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function HomePage() {
  const { t } = useLanguage()
  const [stats, setStats] = useState({
    documents: 0,
    chunks: 0,
    conversations: 0,
    searches: 0,
  })

  useEffect(() => {
    // Mock data - replace with real API call
    setStats({
      documents: 1247,
      chunks: 8934,
      conversations: 523,
      searches: 2891,
    })
  }, [])

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
      return `${diffMins}m ago`
    }
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) {
      return `${diffHours}h ago`
    }
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  const recentActivity = [
    {
      id: "1",
      type: "upload" as const,
      title: "Document uploaded",
      description: "technical-specs.pdf",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "2",
      type: "chat" as const,
      title: "New conversation",
      description: "RAG query about product features",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: "3",
      type: "search" as const,
      title: "Search performed",
      description: 'Query: "authentication methods"',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
  ]

  const statsData = [
    {
      title: t("dashboard.stats.documents"),
      value: stats.documents,
      icon: FileText,
      trend: { value: 12, isPositive: true },
    },
    {
      title: t("dashboard.stats.chunks"),
      value: stats.chunks,
      icon: TrendingUp,
      trend: { value: 8, isPositive: true },
    },
    {
      title: t("dashboard.stats.conversations"),
      value: stats.conversations,
      icon: MessageSquare,
      trend: { value: 5, isPositive: true },
    },
    {
      title: t("dashboard.stats.searches"),
      value: stats.searches,
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
