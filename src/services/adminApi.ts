import axios, { AxiosError } from 'axios'

// The auth router is mounted at the API root, while portfolio resources sit
// under /portfolio. Deriving the origin from the existing variable avoids a
// second one that could drift out of sync in the Vercel dashboard.
const API_ORIGIN = new URL(import.meta.env.VITE_API_URL).origin

/**
 * Client for authenticated admin requests.
 *
 * Separate from the public `api` instance because it sends credentials. The
 * public instance must stay cookie-free so ordinary visitors' requests remain
 * cacheable and carry nothing.
 */
export const adminApi = axios.create({
  baseURL: API_ORIGIN,
  // Without this the browser withholds the session cookie on cross-origin
  // requests, and every admin call would come back 401.
  withCredentials: true,
})

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

// Held in memory rather than read from the readable cookie: that cookie is
// host-only to api.gabrielmayorga.dev, so document.cookie on the dashboard's
// own domain cannot see it. The API returns the token in the login and /auth/me
// bodies instead.
let csrfToken: string | null = null

export const setCsrfToken = (token: string | null) => {
  csrfToken = token
}

adminApi.interceptors.request.use((config) => {
  const method = (config.method ?? 'get').toUpperCase()
  if (!SAFE_METHODS.has(method) && csrfToken) {
    config.headers.set('X-CSRF-Token', csrfToken)
  }
  return config
})

let onUnauthorized: (() => void) | null = null

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  onUnauthorized = handler
}

/**
 * `/auth/me` answering 401 is how the app discovers nobody is logged in, and
 * `/auth/login` answering 401 is a wrong password. Neither is a session that
 * expired mid-use, so neither should trigger the global "you were signed out"
 * handler — doing so would send the login page into a redirect loop.
 */
const isExpectedAuthFailure = (error: AxiosError) => {
  const url = error.config?.url ?? ''
  return url.startsWith('/auth/me') || url.startsWith('/auth/login')
}

adminApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !isExpectedAuthFailure(error)) {
      onUnauthorized?.()
    }
    return Promise.reject(error)
  },
)

/** Pulls the API's `{"detail": ...}` message out, with a readable fallback. */
export const errorMessage = (error: unknown, fallback = 'Something went wrong.'): string => {
  if (error instanceof AxiosError) {
    const detail = (error.response?.data as { detail?: unknown } | undefined)?.detail
    if (typeof detail === 'string') return detail
    if (!error.response) return 'Could not reach the API.'
  }
  return fallback
}
