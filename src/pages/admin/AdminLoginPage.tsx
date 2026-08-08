import { useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router'

import useAdminAuth from '../../hooks/useAdminAuth'
import useNoIndex from '../../hooks/useNoIndex'
import { errorMessage } from '../../services/adminApi'
import { LogoIcon } from '../../assets/icons/index'

interface RedirectState {
  from?: { pathname?: string }
}

const AdminLoginPage = () => {
  useNoIndex('Sign in — Admin')

  const { status, logIn } = useAdminAuth()
  const location = useLocation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Someone already signed in has no business on the login screen; send them
  // wherever they were originally headed.
  if (status === 'authenticated') {
    const intended = (location.state as RedirectState | null)?.from?.pathname
    return <Navigate to={intended ?? '/admin'} replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await logIn(username, password)
    } catch (caught) {
      setError(errorMessage(caught, 'Could not sign in.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className='flex min-h-screen items-center justify-center px-4'>
      <div className='w-full max-w-sm rounded-2xl border border-primary/20 bg-card p-8'>
        <div className='mb-8 flex flex-col items-center gap-3 text-center'>
          <LogoIcon className='h-10 w-10' />
          <h1 className='text-2xl'>Admin</h1>
          <p className='text-sm text-muted-foreground'>Sign in to manage portfolio content.</p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-5' noValidate>
          <div className='flex flex-col gap-2'>
            <label htmlFor='username' className='text-sm text-muted-foreground'>
              Username
            </label>
            <input
              id='username'
              name='username'
              type='text'
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              // Lets a password manager recognise and fill the pair.
              autoComplete='username'
              autoFocus
              required
              className='h-11 rounded-xl border border-primary/30 bg-background px-3 outline-none focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent'
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='password' className='text-sm text-muted-foreground'>
              Password
            </label>
            <input
              id='password'
              name='password'
              type='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete='current-password'
              required
              aria-describedby={error ? 'login-error' : undefined}
              className='h-11 rounded-xl border border-primary/30 bg-background px-3 outline-none focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent'
            />
          </div>

          {error && (
            // role=alert so the failure is announced, not just recoloured.
            <p id='login-error' role='alert' className='text-sm text-red-400'>
              {error}
            </p>
          )}

          <button
            type='submit'
            disabled={submitting || !username || !password}
            className='h-11 cursor-pointer rounded-xl bg-linear-to-r from-primary to-accent font-medium text-white disabled:cursor-not-allowed disabled:opacity-50'
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default AdminLoginPage
