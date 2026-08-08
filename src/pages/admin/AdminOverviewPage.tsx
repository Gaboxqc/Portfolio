import useAdminAuth from '../../hooks/useAdminAuth'
import useNoIndex from '../../hooks/useNoIndex'

const formatWhen = (iso: string | null) => (iso ? new Date(iso).toLocaleString() : 'first sign-in')

/**
 * Landing page for the dashboard. Intentionally thin: the CRUD screens arrive
 * with the next piece of work, and this exists so the authenticated shell is
 * navigable and verifiable now.
 */
const AdminOverviewPage = () => {
  useNoIndex('Overview — Admin')
  const { admin } = useAdminAuth()

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-3xl'>Signed in as {admin?.username}</h1>
        <p className='mt-2 text-muted-foreground'>
          Last sign-in: {formatWhen(admin?.last_login_at ?? null)}
        </p>
      </div>

      <div className='rounded-2xl border border-primary/20 bg-card p-6'>
        <h2 className='text-lg'>Content management</h2>
        <p className='mt-2 text-muted-foreground'>
          Editing screens for projects, courses, certifications and lookups are not built yet. The
          API already supports every operation they will need.
        </p>
      </div>
    </div>
  )
}

export default AdminOverviewPage
