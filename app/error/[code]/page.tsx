"use client"

import { use } from "react"
import { ErrorPage } from "@/components/error-page"
import { isErrorCode, type ErrorCode } from "@/lib/error-handler"

export default function ErrorCodePage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = use(params)
  const numericCode = Number.parseInt(code, 10)

  const errorCode: ErrorCode | "generic" = isErrorCode(numericCode) ? numericCode : "generic"

  return <ErrorPage code={errorCode} />
}
