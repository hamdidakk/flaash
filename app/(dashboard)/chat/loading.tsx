import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function ChatLoading() {
  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Card className="flex-1">
        <Skeleton className="h-full w-full" />
      </Card>
    </div>
  )
}
