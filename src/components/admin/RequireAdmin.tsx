import { Navigate, Outlet, useLocation } from 'react-router'

import useAdminAuth from '../../hooks/useAdminAuth'

/**
 * Gate for the authenticated part of the dashboard.
 *
 * This is a convenience, not the security boundary — the API rejects every
 * unauthenticated write regardless of what the client renders. Its job is to
 * avoid showing a dashboard that would only produce 401s.
 */
const RequireAdmin = () => {
  const { status } = useAdminAuth()
  const location = useLocation()

  // Render nothing until the session probe resolves, otherwise a signed-in user
  // reloading the page would be bounced to the login screen for a moment.
  if (status === 'loading') {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-muted-foreground' role='status'>
          Checking your session…
        </p>
      </div>
    )
  }

  if (status === 'anonymous') {
    // Remember the target so login can return the user to it.
    return <Navigate to='/admin/login' state={{ from: location }} replace />
  }

  return <Outlet />
}

export default RequireAdmin
