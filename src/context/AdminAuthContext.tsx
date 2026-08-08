import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import {
  fetchCurrentAdmin,
  login as loginRequest,
  logout as logoutRequest,
  type AdminSessionInfo,
} from '../services/auth'
import { setCsrfToken, setUnauthorizedHandler } from '../services/adminApi'

/** `loading` covers the initial session probe, before which nothing should render. */
export type AuthStatus = 'loading' | 'authenticated' | 'anonymous'

export interface AdminAuthContextValue {
  status: AuthStatus
  admin: AdminSessionInfo | null
  logIn: (username: string, password: string) => Promise<void>
  logOut: () => Promise<void>
}

// eslint-disable-next-line react-refresh/only-export-components
export const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined)

interface AdminAuthProviderProps {
  children: ReactNode
}

/**
 * Owns the admin session.
 *
 * The session itself lives in an httpOnly cookie the browser attaches on its
 * own, so nothing here stores a credential. What it does hold is the CSRF token
 * and whether a session exists — both re-derived from `/auth/me` on mount, which
 * is what lets a page reload stay signed in.
 *
 * Deliberately not a TanStack Query: the query client retries twice by default,
 * and the 401 that means "not logged in" is an expected answer here, not a
 * failure worth retrying.
 */
const AdminAuthProvider = ({ children }: AdminAuthProviderProps) => {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [admin, setAdmin] = useState<AdminSessionInfo | null>(null)

  const applySession = useCallback((session: AdminSessionInfo | null) => {
    setAdmin(session)
    setCsrfToken(session?.csrf_token ?? null)
    setStatus(session ? 'authenticated' : 'anonymous')
  }, [])

  // Probe for an existing session once on mount.
  useEffect(() => {
    let cancelled = false

    fetchCurrentAdmin()
      .then((session) => {
        if (!cancelled) applySession(session)
      })
      .catch(() => {
        if (!cancelled) applySession(null)
      })

    return () => {
      cancelled = true
    }
  }, [applySession])

  // Drop local state the moment the API reports the session is gone, so an
  // expired cookie shows the login screen instead of a dashboard that 401s on
  // every action.
  useEffect(() => {
    setUnauthorizedHandler(() => applySession(null))
    return () => setUnauthorizedHandler(null)
  }, [applySession])

  const logIn = useCallback(
    async (username: string, password: string) => {
      applySession(await loginRequest(username, password))
    },
    [applySession],
  )

  const logOut = useCallback(async () => {
    try {
      await logoutRequest()
    } finally {
      // Clear locally even if the request failed: the user asked to be signed
      // out, and leaving them looking at a dashboard would be worse than
      // dropping a session the server may still consider open.
      applySession(null)
    }
  }, [applySession])

  const value = useMemo(() => ({ status, admin, logIn, logOut }), [status, admin, logIn, logOut])

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export default AdminAuthProvider
