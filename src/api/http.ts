import { API_URL } from '../lib/config'

/** Thrown for any non-2xx response. `message` is the API's error text when it sends one. */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type Query = Record<string, string | number | boolean | undefined>

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  query?: Query
}

export function buildUrl(path: string, query?: Query): string {
  const url = new URL(path, API_URL.endsWith('/') ? API_URL : `${API_URL}/`)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }
  return url.toString()
}

/** Calls the API and returns the parsed body: JSON when the response is JSON, otherwise text. */
export async function request<T>(
  path: string,
  { method = 'GET', body, query }: RequestOptions = {},
) {
  const response = await fetch(buildUrl(path, query), {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const isJson = response.headers.get('Content-Type')?.includes('application/json')
  const data: unknown = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const message = errorText(data) ?? `${method} ${path} failed with status ${response.status}`
    throw new ApiError(response.status, message)
  }

  return data as T
}

function errorText(data: unknown): string | undefined {
  if (typeof data === 'string') return data || undefined
  if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
    return data.message
  }
  return undefined
}
