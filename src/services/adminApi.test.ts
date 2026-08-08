import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'

import { adminApi, errorMessage, setCsrfToken, setUnauthorizedHandler } from '@/services/adminApi'

/** Runs the registered request interceptors over a config, as axios would. */
const runRequestInterceptors = async (
  config: Partial<InternalAxiosRequestConfig>,
): Promise<InternalAxiosRequestConfig> => {
  let result = { headers: new AxiosHeaders(), ...config } as InternalAxiosRequestConfig
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlers = (adminApi.interceptors.request as any).handlers as Array<{
    fulfilled?: (value: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  }>
  for (const handler of handlers) {
    if (handler?.fulfilled) result = handler.fulfilled(result)
  }
  return result
}

const rejectThroughResponseInterceptors = async (error: AxiosError) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlers = (adminApi.interceptors.response as any).handlers as Array<{
    rejected?: (error: AxiosError) => unknown
  }>
  for (const handler of handlers) {
    if (handler?.rejected) {
      try {
        await handler.rejected(error)
      } catch {
        // The interceptor re-rejects by design.
      }
    }
  }
}

const axiosErrorFor = (url: string, statusCode: number) => {
  const error = new AxiosError('failed')
  error.config = { url, headers: new AxiosHeaders() } as InternalAxiosRequestConfig
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error.response = { status: statusCode } as any
  return error
}

beforeEach(() => {
  setCsrfToken(null)
  setUnauthorizedHandler(null)
})

describe('adminApi credentials', () => {
  it('sends cookies, without which every request would be unauthenticated', () => {
    expect(adminApi.defaults.withCredentials).toBe(true)
  })

  it('targets the API origin, not the /portfolio prefix, so /auth/* resolves', () => {
    expect(adminApi.defaults.baseURL).toBe(new URL(import.meta.env.VITE_API_URL).origin)
  })
})

describe('CSRF header injection', () => {
  it('attaches the token on unsafe methods', async () => {
    setCsrfToken('token-abc')
    const config = await runRequestInterceptors({ method: 'post', url: '/portfolio/tags' })
    expect(config.headers.get('X-CSRF-Token')).toBe('token-abc')
  })

  it('leaves safe methods alone', async () => {
    setCsrfToken('token-abc')
    const config = await runRequestInterceptors({ method: 'get', url: '/portfolio/tags' })
    expect(config.headers.get('X-CSRF-Token')).toBeUndefined()
  })

  it('omits the header when no session has been established', async () => {
    const config = await runRequestInterceptors({ method: 'post', url: '/portfolio/tags' })
    expect(config.headers.get('X-CSRF-Token')).toBeUndefined()
  })
})

describe('401 handling', () => {
  it('reports a session that expired mid-use', async () => {
    const handler = vi.fn()
    setUnauthorizedHandler(handler)
    await rejectThroughResponseInterceptors(axiosErrorFor('/portfolio/projects', 401))
    expect(handler).toHaveBeenCalledOnce()
  })

  // Both are expected answers, not expiries. Firing the handler would send the
  // login page into a redirect loop.
  it.each(['/auth/me', '/auth/login'])('ignores the expected 401 from %s', async (url) => {
    const handler = vi.fn()
    setUnauthorizedHandler(handler)
    await rejectThroughResponseInterceptors(axiosErrorFor(url, 401))
    expect(handler).not.toHaveBeenCalled()
  })

  it('ignores non-401 failures', async () => {
    const handler = vi.fn()
    setUnauthorizedHandler(handler)
    await rejectThroughResponseInterceptors(axiosErrorFor('/portfolio/projects', 500))
    expect(handler).not.toHaveBeenCalled()
  })
})

describe('errorMessage', () => {
  it("surfaces the API's detail string", () => {
    const error = new AxiosError('failed')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error.response = { status: 401, data: { detail: 'Invalid credentials.' } } as any
    expect(errorMessage(error)).toBe('Invalid credentials.')
  })

  it('explains an unreachable API rather than showing a generic failure', () => {
    expect(errorMessage(new AxiosError('Network Error'))).toBe('Could not reach the API.')
  })

  it('falls back for anything unrecognised', () => {
    expect(errorMessage(new Error('boom'), 'Could not sign in.')).toBe('Could not sign in.')
  })
})
