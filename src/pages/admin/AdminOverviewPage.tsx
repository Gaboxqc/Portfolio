import { useState } from 'react'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'

import ConfirmDialog from '../../components/admin/ConfirmDialog'
import useAdminAuth from '../../hooks/useAdminAuth'
import useNoIndex from '../../hooks/useNoIndex'
import { errorMessage } from '../../services/adminApi'
import { fetchSessions, revokeAllSessions } from '../../services/auth'

const formatWhen = (iso: string | null) => (iso ? new Date(iso).toLocaleString() : 'first sign-in')

const SHORTCUTS = [
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/courses', label: 'Courses' },
  { to: '/admin/certifications', label: 'Certifications' },
  { to: '/admin/lookups', label: 'Lookups' },
]

/**
 * Dashboard landing page: who you are, where to go, and which sessions are open.
 *
 * The session list exists so an unfamiliar one can be spotted, which is only
 * useful alongside a way to act on it — hence the revoke control beside it.
 */
const AdminOverviewPage = () => {
  useNoIndex('Overview — Admin')
  const { admin, logOut } = useAdminAuth()

  const [confirming, setConfirming] = useState(false)
  const [revokeError, setRevokeError] = useState<string | null>(null)
  const [revoking, setRevoking] = useState(false)

  const sessions = useQuery({
    queryKey: ['admin', 'sessions'],
    queryFn: fetchSessions,
    staleTime: 0,
  })

  const active = (sessions.data ?? []).filter((session) => !session.revoked)

  const handleRevokeAll = async () => {
    setRevoking(true)
    setRevokeError(null)
    try {
      await revokeAllSessions()
      // The server closed this session too, so clear local state rather than
      // leaving a dashboard that 401s on the next action.
      await logOut()
    } catch (caught) {
      setRevokeError(errorMessage(caught, 'Could not revoke sessions.'))
      setRevoking(false)
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-3xl'>Signed in as {admin?.username}</h1>
        <p className='mt-2 text-muted-foreground'>
          Last sign-in: {formatWhen(admin?.last_login_at ?? null)}
        </p>
      </div>

      <nav aria-label='Content shortcuts' className='flex flex-wrap gap-3'>
        {SHORTCUTS.map((shortcut) => (
          <Link
            key={shortcut.to}
            to={shortcut.to}
            className='rounded-xl border border-primary/20 bg-card px-5 py-4 hover:border-primary/50'
          >
            {shortcut.label}
          </Link>
        ))}
      </nav>

      <section className='flex flex-col gap-4 rounded-2xl border border-primary/20 bg-card p-6'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <h2 className='text-lg'>Active sessions</h2>
          <button
            type='button'
            onClick={() => {
              setRevokeError(null)
              setConfirming(true)
            }}
            disabled={active.length === 0}
            className='cursor-pointer rounded-lg px-3 py-2 text-sm text-red-400 outline-1 outline-red-500/40 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40'
          >
            Sign out everywhere
          </button>
        </div>

        {sessions.isLoading && <p className='text-sm text-muted-foreground'>Loading sessions…</p>}

        {sessions.error && (
          <p role='alert' className='text-sm text-red-400'>
            {errorMessage(sessions.error, 'Could not load sessions.')}
          </p>
        )}

        {revokeError && (
          <p role='alert' className='text-sm text-red-400'>
            {revokeError}
          </p>
        )}

        {active.length > 0 && (
          <ul className='flex flex-col gap-3'>
            {active.map((session) => (
              <li key={session.id} className='flex flex-wrap items-baseline gap-x-3 text-sm'>
                <span>{session.ip_address ?? 'unknown address'}</span>
                {session.current && <span className='text-accent'>this device</span>}
                <span className='text-muted-foreground'>
                  last used {formatWhen(session.last_used_at)}
                </span>
                {session.user_agent && (
                  <span className='w-full truncate text-xs text-muted-foreground/70'>
                    {session.user_agent}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <ConfirmDialog
        open={confirming}
        title='Sign out of every session?'
        message='Every signed-in device is logged out, including this one. Use this if you see a session you do not recognise.'
        confirmLabel='Sign out everywhere'
        busy={revoking}
        onConfirm={handleRevokeAll}
        onCancel={() => setConfirming(false)}
      />
    </div>
  )
}

export default AdminOverviewPage
