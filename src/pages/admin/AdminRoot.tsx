import { Suspense } from 'react'
import { Outlet } from 'react-router'

import AdminAuthProvider from '../../context/AdminAuthContext'
import LanguageProvider from '../../context/LanguageContext'

/**
 * Wrapper for every `/admin` route.
 *
 * Sits outside the public `Layout`, so the dashboard gets no marketing navbar or
 * footer. `LanguageProvider` is still present because shared components such as
 * AsyncCollection read from it; the admin UI's own copy stays in English, since
 * it has exactly one user.
 */
const AdminRoot = () => (
  <LanguageProvider>
    <AdminAuthProvider>
      <Suspense fallback={<div className='min-h-screen' />}>
        <Outlet />
      </Suspense>
    </AdminAuthProvider>
  </LanguageProvider>
)

export default AdminRoot
