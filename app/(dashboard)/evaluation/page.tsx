"use client"

import * as React from "react"
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import { Target, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react"
import { MetricBar } from "@/components/dashboard/metric-bar"
const evaluationSnapshot = {
  averageRetrievalGrade: 0,
  averageGenerationGrade: 0,
  totalEvaluations: 0,
  lastEvaluated: "-",
  retrievalMetrics: [
    { label: "Precision", value: 0, percentage: 0 },
    { label: "Recall", value: 0, percentage: 0 },
    { label: "Relevance", value: 0, percentage: 0 },
  ],
  generationMetrics: [
    { label: "Accuracy", value: 0, percentage: 0 },
    { label: "Coherence", value: 0, percentage: 0 },
    { label: "Completeness", value: 0, percentage: 0 },
  ],
}

export default function EvaluationPage() {
  const { t } = useLanguage()
  const [isRunningEval, setIsRunningEval] = React.useState(false)
  const [isRunningRetrieval, setIsRunningRetrieval] = React.useState(false)
  const [evalOutput, setEvalOutput] = React.useState<string>("")
  const [errorMsg, setErrorMsg] = React.useState<string>("")
  const [avgRetrieval, setAvgRetrieval] = React.useState<number>(0)
  const [avgGeneration, setAvgGeneration] = React.useState<number>(0)

  const evaluationData = {
    ...evaluationSnapshot,
    retrievalMetrics: evaluationSnapshot.retrievalMetrics.map((metric, index) => ({
      label: [t("evaluation.precision"), t("evaluation.recall"), t("evaluation.relevance")][index] ?? metric.label,
      value: metric.value,
      percentage: metric.percentage,
    })),
    generationMetrics: evaluationSnapshot.generationMetrics.map((metric, index) => ({
      label: [t("evaluation.accuracy"), t("evaluation.coherence"), t("evaluation.completeness")][index] ?? metric.label,
      value: metric.value,
      percentage: metric.percentage,
    })),
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

  async function handleRunEvaluation() {
    setIsRunningEval(true)
    setErrorMsg("")
    try {
      const resp = await fetch("/api/evaluation/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ test_set: "questions", prompt: "long" }),
      })
      const text = await resp.text()
      try {
        const json = JSON.parse(text)
        setEvalOutput(JSON.stringify(json, null, 2))
        if (typeof json.average_retrieval_grade === "number") setAvgRetrieval(json.average_retrieval_grade)
        if (typeof json.average_generation_grade === "number") setAvgGeneration(json.average_generation_grade)
      } catch {
        setEvalOutput(text)
      }
    } catch (e) {
      setErrorMsg(String(e instanceof Error ? e.message : e))
    } finally {
      setIsRunningEval(false)
    }
  }

  async function handleRunRetrievalEval() {
    setIsRunningRetrieval(true)
    setErrorMsg("")
    try {
      const resp = await fetch("/api/evaluation/retrieval", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ test_set: "flaash_questions" }),
      })
      const text = await resp.text()
      try {
        const json = JSON.parse(text)
        setEvalOutput(JSON.stringify(json, null, 2))
        if (typeof json.average_retrieval_grade === "number") setAvgRetrieval(json.average_retrieval_grade)
      } catch {
        setEvalOutput(text)
      }
    } catch (e) {
      setErrorMsg(String(e instanceof Error ? e.message : e))
    } finally {
      setIsRunningRetrieval(false)
    }
  }

  return (
    <div className="space-y-6">
      <DashboardPageHeader title={t("evaluation.title")} description={t("evaluation.description")} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("evaluation.retrievalGrade")}</p>
                <h3 className={`text-3xl font-bold ${getGradeColor(avgRetrieval)}`}>
                  {avgRetrieval}/10
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
                <h3 className={`text-3xl font-bold ${getGradeColor(avgGeneration)}`}>
                  {avgGeneration}/10
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
        <div className="flex items-center gap-2 mb-4">
          <Button size="sm" onClick={handleRunEvaluation} disabled={isRunningEval}>
            {isRunningEval ? "…" : "Lancer évaluation"}
          </Button>
          <Button size="sm" variant="outline" onClick={handleRunRetrievalEval} disabled={isRunningRetrieval}>
            {isRunningRetrieval ? "…" : "Évaluer retrieval"}
          </Button>
        </div>
        {errorMsg && (
          <div className="mb-3 text-sm text-destructive">
            {errorMsg}
          </div>
        )}
        {evalOutput && (
          <pre className="max-h-72 overflow-auto rounded-md bg-muted p-3 text-xs">
{evalOutput}
          </pre>
        )}
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
                {((avgRetrieval + avgGeneration) / 2).toFixed(1)}/10
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

