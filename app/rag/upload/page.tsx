"use client"

import dynamic from "next/dynamic"

const RagUploadClient = dynamic(() => import("@/components/rag/RagUploadClient").then((mod) => ({ default: mod.RagUploadClient })), {
  loading: () => (
    <div className="rag-main__content">
      <div className="rag-card p-6">
        <div className="space-y-4">
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-96 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    </div>
  ),
  ssr: false,
})

export default function RagUploadPage() {
  return <RagUploadClient />
}

