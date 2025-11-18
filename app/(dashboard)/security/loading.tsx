"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function SecurityPageLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={`stat-${index}`}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
              <CardTitle>
                <Skeleton className="h-8 w-16" />
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {[0, 1].map((block) => (
        <Card key={`block-${block}`}>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 4 }).map((_, row) => (
              <Skeleton key={`row-${row}`} className="h-4 w-full" />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}


