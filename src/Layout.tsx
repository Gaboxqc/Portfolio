import { Suspense } from 'react'
import { Outlet } from 'react-router'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LanguageProvider from './context/LanguageContext'
import { useScrollRestoration } from './hooks/useScrollRestoration'

const Layout = () => {
  useScrollRestoration()
  return (
    <LanguageProvider>
      <div>
        <header>
          <Navbar />
        </header>
        <main>
          {/* Boundary for the code-split routes. */}
          <Suspense fallback={<div className='min-h-screen' />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  )
}

export default Layout
