import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router'

import useAdminAuth from '../../hooks/useAdminAuth'
import { LogoIcon } from '../../assets/icons/index'

// Phase D fills these in; the shell is here so navigation exists from the start.
const SECTIONS = [
  { label: 'Overview', to: '/admin', end: true },
  { label: 'Projects', to: '/admin/projects', end: false },
  { label: 'Courses', to: '/admin/courses', end: false },
  { label: 'Certifications', to: '/admin/certifications', end: false },
  { label: 'Lookups', to: '/admin/lookups', end: false },
]

const AdminLayout = () => {
  const { admin, logOut } = useAdminAuth()
  const [signingOut, setSigningOut] = useState(false)

  const handleLogOut = async () => {
    setSigningOut(true)
    try {
      await logOut()
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <div className='min-h-screen'>
      <header className='border-b border-primary/20 bg-card/60'>
        <div className='container mx-auto flex flex-wrap items-center gap-4 px-4 py-4'>
          <Link to='/admin' className='flex items-center gap-2'>
            <LogoIcon className='h-8 w-8' />
            <span className='font-bold'>Admin</span>
          </Link>

          <nav aria-label='Admin sections' className='flex flex-wrap gap-1'>
            {SECTIONS.map((section) => (
              <NavLink
                key={section.to}
                to={section.to}
                end={section.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    isActive
                      ? 'bg-primary/20 text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                {section.label}
              </NavLink>
            ))}
          </nav>

          <div className='ml-auto flex items-center gap-3'>
            <Link
              to='/'
              className='text-sm text-muted-foreground hover:text-accent'
              title='Open the public site'
            >
              View site
            </Link>
            {admin && <span className='text-sm text-muted-foreground'>{admin.username}</span>}
            <button
              type='button'
              onClick={handleLogOut}
              disabled={signingOut}
              className='cursor-pointer rounded-lg bg-primary/10 px-3 py-2 text-sm outline-1 hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50'
            >
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      </header>

      <main className='container mx-auto px-4 py-8'>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
