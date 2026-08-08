import { lazy } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import HomePage from './pages/HomePage'
import ErrorPage from './pages/ErrorPage'
import Layout from './Layout'

// The home page is the common entry point, so it stays in the main bundle.
// The filter-heavy routes are split out and fetched on navigation.
const CoursesPage = lazy(() => import('./pages/CoursesPage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

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
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

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
