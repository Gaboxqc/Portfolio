import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

/**
 * Route-level error boundary. Rendered instead of the layout when anything in the
 * route tree throws, so a single bad render degrades to a recoverable page rather
 * than a blank screen.
 */
const ErrorPage = () => {
  const error = useRouteError()

  const status = isRouteErrorResponse(error) ? error.status : null
  const detail = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
      ? error.message
      : null

  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center'>
      {status && <p className='text-6xl font-bold text-accent'>{status}</p>}
      <h1 className='text-3xl'>Something went wrong</h1>
      <p className='max-w-md text-muted-foreground'>
        An unexpected error occurred while loading this page. Reloading usually fixes it.
      </p>
      {detail && <p className='max-w-md text-sm text-muted-foreground/70'>{detail}</p>}
      <div className='flex gap-4'>
        <button
          type='button'
          onClick={() => window.location.reload()}
          className='cursor-pointer rounded-lg bg-primary/20 px-6 py-3 outline-1 hover:bg-primary/30'
        >
          Reload
        </button>
        <Link
          to='/'
          className='rounded-lg bg-linear-to-r from-primary to-accent px-6 py-3 text-white'
        >
          Back home
        </Link>
      </div>
    </main>
  )
}

export default ErrorPage
