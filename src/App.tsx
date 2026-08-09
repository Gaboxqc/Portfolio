import { lazy } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'framer-motion'

import HomePage from './pages/HomePage'
import ErrorPage from './pages/ErrorPage'
import Layout from './Layout'

// The home page is the common entry point, so it stays in the main bundle.
// The filter-heavy routes are split out and fetched on navigation.
const CoursesPage = lazy(() => import('./pages/CoursesPage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// The whole dashboard is lazy, so a public visitor downloads none of it.
const AdminRoot = lazy(() => import('./pages/admin/AdminRoot'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminOverviewPage = lazy(() => import('./pages/admin/AdminOverviewPage'))
const RequireAdmin = lazy(() => import('./components/admin/RequireAdmin'))
const AdminProjectsPage = lazy(() => import('./pages/admin/AdminProjectsPage'))
const AdminCoursesPage = lazy(() => import('./pages/admin/AdminCoursesPage'))
const AdminCertificationsPage = lazy(() => import('./pages/admin/AdminCertificationsPage'))
const AdminLookupsPage = lazy(() => import('./pages/admin/AdminLookupsPage'))
const ProjectFormPage = lazy(() => import('./pages/admin/ProjectFormPage'))
const CredentialFormPage = lazy(() => import('./pages/admin/CredentialFormPage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Portfolio content changes rarely; avoid refetching it on every
      // navigation or tab focus.
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'courses', element: <CoursesPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  // A sibling of '/' rather than a child, so the dashboard skips the public
  // navbar and footer entirely and is matched ahead of the '*' catch-all above.
  {
    path: '/admin',
    element: <AdminRoot />,
    errorElement: <ErrorPage />,
    children: [
      { path: 'login', element: <AdminLoginPage /> },
      {
        element: <RequireAdmin />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminOverviewPage /> },
              { path: 'projects', element: <AdminProjectsPage /> },
              // ':id' is 'new' for a create, or a numeric id for an edit, so one
              // component covers both and cannot drift between them.
              { path: 'projects/:id', element: <ProjectFormPage /> },
              { path: 'courses', element: <AdminCoursesPage /> },
              { path: 'courses/:id', element: <CredentialFormPage kind='course' /> },
              { path: 'certifications', element: <AdminCertificationsPage /> },
              {
                path: 'certifications/:id',
                element: <CredentialFormPage kind='certification' />,
              },
              { path: 'lookups', element: <AdminLookupsPage /> },
            ],
          },
        ],
      },
    ],
  },
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* reducedMotion="user" makes every framer-motion transform and layout
          animation respect the OS "reduce motion" setting. Opacity fades are
          kept, since they do not cause motion sickness. */}
      <MotionConfig reducedMotion='user'>
        <RouterProvider router={router} />
      </MotionConfig>

      <div
        aria-hidden='true'
        className='bg-glow bg-glow-a fixed bottom-0 -z-10 h-150 w-150 rounded-full bg-[#00D4FF] blur-[120px]'
      />
      <div
        aria-hidden='true'
        className='bg-glow bg-glow-b fixed top-0 right-0 -z-10 h-150 w-150 rounded-full bg-[#5B8DEF] blur-[120px]'
      />

      <Analytics />
      <SpeedInsights />
    </QueryClientProvider>
  )
}

export default App
