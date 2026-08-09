import { adminApi } from './adminApi'

export interface AdminSessionInfo {
  username: string
  last_login_at: string | null
  csrf_token: string
}

export const login = (username: string, password: string): Promise<AdminSessionInfo> =>
  adminApi.post<AdminSessionInfo>('/auth/login', { username, password }).then((res) => res.data)

export const logout = (): Promise<void> => adminApi.post('/auth/logout').then(() => undefined)

/** Resolves when a session cookie is still valid; rejects with 401 otherwise. */
export const fetchCurrentAdmin = (): Promise<AdminSessionInfo> =>
  adminApi.get<AdminSessionInfo>('/auth/me').then((res) => res.data)

export interface AdminSessionRow {
  id: number
  current: boolean
  created_at: string
  last_used_at: string
  expires_at: string
  revoked: boolean
  ip_address: string | null
  user_agent: string | null
}

export const fetchSessions = (): Promise<AdminSessionRow[]> =>
  adminApi.get<AdminSessionRow[]>('/auth/sessions').then((res) => res.data)

/** Closes every session, this one included — see the API route for why. */
export const revokeAllSessions = (): Promise<void> =>
  adminApi.post('/auth/sessions/revoke-all').then(() => undefined)
