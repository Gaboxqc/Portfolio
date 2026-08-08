import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'

import RequireAdmin from '@/components/admin/RequireAdmin'
import { AdminAuthContext, type AuthStatus } from '@/context/AdminAuthContext'

const renderAt = (status: AuthStatus) => {
  const router = createMemoryRouter(
    [
      {
        path: '/admin',
        element: (
          <AdminAuthContext.Provider
            value={{ status, admin: null, logIn: vi.fn(), logOut: vi.fn() }}
          >
            <RequireAdmin />
          </AdminAuthContext.Provider>
        ),
        children: [{ index: true, element: <p>secret dashboard</p> }],
      },
      { path: '/admin/login', element: <p>login screen</p> },
    ],
    { initialEntries: ['/admin'] },
  )
  return render(<RouterProvider router={router} />)
}

describe('RequireAdmin', () => {
  it('renders the protected route when authenticated', () => {
    renderAt('authenticated')
    expect(screen.getByText('secret dashboard')).toBeInTheDocument()
  })

  it('redirects to login when anonymous', () => {
    renderAt('anonymous')
    expect(screen.getByText('login screen')).toBeInTheDocument()
    expect(screen.queryByText('secret dashboard')).not.toBeInTheDocument()
  })

  // Redirecting during the probe would bounce a signed-in user to the login
  // screen on every page reload.
  it('waits while the session probe is still running', () => {
    renderAt('loading')
    expect(screen.queryByText('login screen')).not.toBeInTheDocument()
    expect(screen.queryByText('secret dashboard')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
