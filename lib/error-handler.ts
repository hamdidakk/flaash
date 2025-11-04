export type ErrorCode = 400 | 401 | 403 | 404 | 500 | 503

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message?: string,
    public details?: unknown,
  ) {
    super(message)
    this.name = "AppError"
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
  return [400, 401, 403, 404, 500, 503].includes(code)
}
