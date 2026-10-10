export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/+$/, '')

/** Error thrown for any failed API call. `messages` is always non-empty and safe to show to users. */
export class ApiError extends Error {
  readonly status: number
  readonly messages: string[]

  constructor(status: number, messages: string[]) {
    super(messages[0])
    this.name = 'ApiError'
    this.status = status
    this.messages = messages
  }
}

/**
 * Normalises cm-api error bodies into a list of messages.
 * cm-api responds with `{ errors: string[] }` for validation failures and `{ error: string }` otherwise.
 */
export function parseErrorMessages(body: unknown, status: number): string[] {
  if (body && typeof body === 'object') {
    if ('errors' in body && Array.isArray(body.errors)) {
      const messages = body.errors.filter((m): m is string => typeof m === 'string' && m.length > 0)
      if (messages.length > 0) return messages
    }
    if ('error' in body && typeof body.error === 'string' && body.error.length > 0) {
      return [body.error]
    }
  }
  return [`The server returned an unexpected error (status ${status}).`]
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body !== undefined) headers.set('Content-Type', 'application/json')

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, { ...init, headers })
  } catch (err) {
    // Let TanStack Query see cancellations as-is.
    if (init.signal?.aborted) throw err
    throw new ApiError(0, ['Could not reach the server. Check that cm-api is running and try again.'])
  }

  if (response.status === 204) return undefined as T

  const body: unknown = await response.json().catch(() => null)
  if (!response.ok) throw new ApiError(response.status, parseErrorMessages(body, response.status))
  return body as T
}

/** User-facing messages for any error (empty when there is no error). */
export function errorMessages(error: unknown): string[] {
  if (!error) return []
  if (error instanceof ApiError) return error.messages
  return [error instanceof Error && error.message ? error.message : 'Something went wrong.']
}

export function isNotFound(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404
}
