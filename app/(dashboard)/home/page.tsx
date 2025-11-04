"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { QuickActionsSection } from "@/components/dashboard/quick-actions-section"
import { RecentActivitySection } from "@/components/dashboard/recent-activity-section"
import { CostManagementCard } from "@/components/dashboard/cost-management-card"
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

  const [costData, setCostData] = useState({
    totalCost: 0,
    tokensUsed: 0,
    estimatedCost: 0,
    breakdown: {
      embedding: 0,
      completion: 0,
      search: 0,
      storage: 0,
    },
    alerts: {
      threshold: 0,
      current: 0,
      isNearLimit: false,
    },
  })

  useEffect(() => {
    // Mock data - replace with real API call
    setStats({
      documents: 1247,
      chunks: 8934,
      conversations: 523,
      searches: 2891,
    })

    setCostData({
      totalCost: 127.5,
      tokensUsed: 2847500,
      estimatedCost: 145.2,
      breakdown: {
        embedding: 45.3,
        completion: 62.8,
        search: 12.4,
        storage: 7.0,
      },
      alerts: {
        threshold: 150.0,
        current: 127.5,
        isNearLimit: true,
      },
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
      id: "1",
      type: "upload" as const,
      title: t("dashboard.activity.documentUploaded"),
      description: "technical-specs.pdf",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "2",
      type: "chat" as const,
      title: t("dashboard.activity.newConversation"),
      description: "RAG query about product features",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: "3",
      type: "search" as const,
      title: t("dashboard.activity.searchPerformed"),
      description: `${t("dashboard.activity.query")}: "authentication methods"`,
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
