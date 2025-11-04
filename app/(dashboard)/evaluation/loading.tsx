import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function EvaluationLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <Skeleton className="h-32 w-full" />
        </Card>
        <Card className="p-6">
          <Skeleton className="h-32 w-full" />
        </Card>
      </div>

      <Card className="p-6">
        <Skeleton className="h-48 w-full" />
      </Card>
    </div>
  )
}
