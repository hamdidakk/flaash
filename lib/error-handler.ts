// Sentry removed

export type ErrorCode = 400 | 401 | 403 | 404 | 500 | 503 | 429
export const ThrottlingStatus = [429, 403] as const
export type ThrottlingCode = (typeof ThrottlingStatus)[number]

export class AppError extends Error {
  constructor(public code: ErrorCode, message?: string, public details?: unknown, public throttled?: boolean) {
    super(message)
    this.name = "AppError"
    this.throttled = throttled ?? ThrottlingStatus.includes(code as ThrottlingCode)
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    // Map common error patterns to specific error codes
    if (error.message.includes("unauthorized") || error.message.includes("authentication")) {
      return new AppError(401, error.message)
    }
    if (error.message.includes("forbidden") || error.message.includes("permission")) {
      return new AppError(403, error.message)
    }
    if (error.message.includes("not found")) {
      return new AppError(404, error.message)
    }
    if (error.message.includes("bad request") || error.message.includes("invalid")) {
      return new AppError(400, error.message)
    }
  }

  // Default to 500 for unknown errors
  return new AppError(500, "An unexpected error occurred", error)
}

export function isErrorCode(code: number): code is ErrorCode {
  return [400, 401, 403, 404, 429, 500, 503].includes(code)
}

export interface RetryConfig {
  maxRetries: number
  delayMs: number
  backoff?: boolean
}

export interface ErrorLog {
  timestamp: Date
  code: ErrorCode
  message: string
  details?: unknown
  userAgent?: string
  url?: string
}

export class ErrorLogger {
  private static logs: ErrorLog[] = []
  private static maxLogs = 100

  static log(error: AppError, context?: { url?: string }) {
    const log: ErrorLog = {
      timestamp: new Date(),
      code: error.code,
      message: error.message,
      details: error.details,
      userAgent: typeof window !== "undefined" ? window.navigator.userAgent : undefined,
      url: context?.url || (typeof window !== "undefined" ? window.location.href : undefined),
    }

    this.logs.unshift(log)
    if (this.logs.length > this.maxLogs) {
      this.logs.pop()
    }

    // Log to console in development with structured payload
    if (process.env.NODE_ENV === "development") {
      const isClientError = error.code >= 400 && error.code < 500
      try {
        const payload = JSON.stringify(log, null, 2)
        if (isClientError) {
          console.warn("[v0] Warning:", payload)
        } else {
          console.error("[v0] Error logged:", payload)
        }
      } catch {
        if (isClientError) {
          console.warn("[v0] Warning:", log)
        } else {
          console.error("[v0] Error logged:", log)
        }
      }
    }

    // Hook for external error tracking can be added here if needed
  }

  static getLogs(): ErrorLog[] {
    return [...this.logs]
  }

  static clearLogs() {
    this.logs = []
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = { maxRetries: 3, delayMs: 1000, backoff: true },
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Don't retry on client errors (4xx)
      if (error instanceof AppError && error.code >= 400 && error.code < 500) {
        throw error
      }

      // If this was the last attempt, throw the error
      if (attempt === config.maxRetries) {
        break
      }

      // Calculate delay with optional exponential backoff
      const delay = config.backoff ? config.delayMs * Math.pow(2, attempt) : config.delayMs

      console.log(`[v0] Retry attempt ${attempt + 1}/${config.maxRetries} after ${delay}ms`)

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

export async function fetchWithRetry(url: string, options?: RequestInit, retryConfig?: RetryConfig): Promise<Response> {
  return withRetry(async () => {
    const response = await fetch(url, options)

    if (!response.ok) {
      const errorCode = response.status as ErrorCode
      const errorMessage = await response.text().catch(() => response.statusText)

      const error = new AppError(
        isErrorCode(response.status) ? errorCode : 500,
        errorMessage || `HTTP ${response.status}`,
        { url, status: response.status },
      )

      ErrorLogger.log(error, { url })
      throw error
    }

    return response
  }, retryConfig)
}

export async function safeAsync<T>(fn: () => Promise<T>, fallback?: T): Promise<{ data?: T; error?: AppError }> {
  try {
    const data = await fn()
    return { data }
  } catch (error) {
    const appError = handleError(error)
    ErrorLogger.log(appError)
    return { error: appError, data: fallback }
  }
}
