"use client"

import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/lib/language-context"
import { Loader2, CheckCircle2, XCircle, Pause } from "lucide-react"

export default function JobsPage() {
  const { t } = useLanguage()

  const jobs = [
    { id: 1, name: "Batch Upload - 50 documents", status: "running", progress: 65, startedAt: "10:30 AM" },
    { id: 2, name: "Document Reprocessing", status: "completed", progress: 100, startedAt: "09:15 AM" },
    { id: 3, name: "Index Optimization", status: "failed", progress: 45, startedAt: "08:00 AM" },
  ]

  return (
    <div className="space-y-6">
      <DashboardPageHeader title={t("jobs.title")} description={t("jobs.description")} />

      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {job.status === "running" && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
                {job.status === "completed" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                {job.status === "failed" && <XCircle className="h-5 w-5 text-destructive" />}
                <div>
                  <h3 className="font-semibold">{job.name}</h3>
                  <p className="text-sm text-muted-foreground">Started at {job.startedAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    job.status === "running" ? "default" : job.status === "completed" ? "secondary" : "destructive"
                  }
                >
                  {t(`jobs.status.${job.status}`)}
                </Badge>
                {job.status === "running" && (
                  <Button variant="ghost" size="sm">
                    <Pause className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("jobs.progress")}</span>
                <span className="font-medium">{job.progress}%</span>
              </div>
              <Progress value={job.progress} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

