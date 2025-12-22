const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export interface ApiError {
  message: string
  status?: number
  data?: unknown
}

export class HttpError extends Error {
  status: number
  data?: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.data = data
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return await response.json()
  }
  return (await response.text()) as unknown as T
}

function getErrorMessage(errorData: unknown): string | undefined {
  if (!errorData || typeof errorData !== 'object') return undefined
  const obj = errorData as Record<string, unknown>

  const message = obj.message
  if (typeof message === 'string' && message.trim()) return message

  const detail = obj.detail
  if (typeof detail === 'string' && detail.trim()) return detail

  return undefined
}

export interface HttpRequestOptions extends RequestInit {
  params?: Record<string, string | number>
}

function buildUrlWithParams(baseUrl: string, params?: Record<string, string | number>): string {
  if (!params) return baseUrl

  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  const queryString = searchParams.toString()
  if (!queryString) return baseUrl

  return baseUrl + (baseUrl.includes('?') ? '&' : '?') + queryString
}

export async function httpRequest<T>(
  endpoint: string,
  options: HttpRequestOptions = {}
): Promise<T> {
  let url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
  const { params, ...fetchOptions } = options
  url = buildUrlWithParams(url, params)

  const config: RequestInit = {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await parseResponse<unknown>(response).catch(() => null)
      throw new HttpError(
        getErrorMessage(errorData) || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      )
    }

    return await parseResponse<T>(response)
  } catch (error) {
    if (error instanceof HttpError) {
      throw error
    }
    throw new HttpError(error instanceof Error ? error.message : 'Network error', 0, error)
  }
}

export const http = {
  get: <T>(endpoint: string, options?: HttpRequestOptions) =>
    httpRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: HttpRequestOptions) =>
    httpRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: HttpRequestOptions) =>
    httpRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: HttpRequestOptions) =>
    httpRequest<T>(endpoint, { ...options, method: 'DELETE' }),
}
