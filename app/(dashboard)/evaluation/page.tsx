"use client"

import { PageHeader } from "@/components/page-header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import { Target, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react"
import { MetricBar } from "@/components/dashboard/metric-bar"

export default function EvaluationPage() {
  const { t } = useLanguage()

  const evaluationData = {
    averageRetrievalGrade: 9.2,
    averageGenerationGrade: 8.5,
    totalEvaluations: 1247,
    lastEvaluated: "2025-01-15 14:30",
    retrievalMetrics: [
      { label: t("evaluation.precision"), value: 9.5, percentage: 95 },
      { label: t("evaluation.recall"), value: 8.9, percentage: 89 },
      { label: t("evaluation.relevance"), value: 9.2, percentage: 92 },
    ],
    generationMetrics: [
      { label: t("evaluation.accuracy"), value: 8.7, percentage: 87 },
      { label: t("evaluation.coherence"), value: 8.9, percentage: 89 },
      { label: t("evaluation.completeness"), value: 8.0, percentage: 80 },
    ],
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 9) return "text-green-600 dark:text-green-400"
    if (grade >= 7) return "text-blue-600 dark:text-blue-400"
    if (grade >= 5) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getGradeBadge = (grade: number) => {
    if (grade >= 9) return <Badge className="bg-green-500">Excellent</Badge>
    if (grade >= 7) return <Badge className="bg-blue-500">Good</Badge>
    if (grade >= 5) return <Badge className="bg-yellow-500">Fair</Badge>
    return <Badge className="bg-red-500">Poor</Badge>
  }

  return (
    <div className="space-y-6">
      <PageHeader title={t("evaluation.title")} description={t("evaluation.description")} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("evaluation.retrievalGrade")}</p>
                <h3 className={`text-3xl font-bold ${getGradeColor(evaluationData.averageRetrievalGrade)}`}>
                  {evaluationData.averageRetrievalGrade}/10
                </h3>
              </div>
            </div>
            {getGradeBadge(evaluationData.averageRetrievalGrade)}
          </div>
          <div className="space-y-3">
            {evaluationData.retrievalMetrics.map((metric, index) => (
              <MetricBar
                key={index}
                label={metric.label}
                value={`${metric.value}/10`}
                percentage={metric.percentage}
                color="bg-green-500"
              />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("evaluation.generationGrade")}</p>
                <h3 className={`text-3xl font-bold ${getGradeColor(evaluationData.averageGenerationGrade)}`}>
                  {evaluationData.averageGenerationGrade}/10
                </h3>
              </div>
            </div>
            {getGradeBadge(evaluationData.averageGenerationGrade)}
          </div>
          <div className="space-y-3">
            {evaluationData.generationMetrics.map((metric, index) => (
              <MetricBar
                key={index}
                label={metric.label}
                value={`${metric.value}/10`}
                percentage={metric.percentage}
                color="bg-blue-500"
              />
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t("evaluation.summary")}</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm text-muted-foreground">{t("evaluation.totalEvaluations")}</p>
              <p className="text-xl font-semibold">{evaluationData.totalEvaluations.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-muted-foreground">{t("evaluation.lastEvaluated")}</p>
              <p className="text-xl font-semibold">{evaluationData.lastEvaluated}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-sm text-muted-foreground">{t("evaluation.overallScore")}</p>
              <p className="text-xl font-semibold">
                {((evaluationData.averageRetrievalGrade + evaluationData.averageGenerationGrade) / 2).toFixed(1)}/10
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
