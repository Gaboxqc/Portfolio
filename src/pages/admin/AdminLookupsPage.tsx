import { useState, type FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import AcademyLogo from '../../components/ui/AcademyLogo'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { useAdminList, useAdminMutations } from '../../hooks/admin/useAdminResource'
import useNoIndex from '../../hooks/useNoIndex'
import { errorMessage } from '../../services/adminApi'
import { ADMIN_PATHS } from '../../services/admin/resources'
import type { FilterOption } from '../../types'

interface LookupWrite {
  name: string
  /** Academies only; the other tables reject unknown fields. */
  image_url?: string | null
}

/** An academy row carries a logo alongside its name. */
interface LookupRow extends FilterOption {
  image_url?: string | null
}

const TABLES = [
  { key: 'tags', label: 'Tags', path: ADMIN_PATHS.tags },
  // Academies are the one lookup that is not just a name: their logo is shown
  // beside every course and certification from that academy.
  { key: 'academies', label: 'Academies', path: ADMIN_PATHS.academies, withLogo: true },
  { key: 'categories', label: 'Categories', path: ADMIN_PATHS.categories },
  { key: 'projectTypes', label: 'Project types', path: ADMIN_PATHS.projectTypes },
  { key: 'difficultyLevels', label: 'Difficulty levels', path: ADMIN_PATHS.difficultyLevels },
] as const

/**
 * One lookup table: list, add, rename inline, delete.
 *
 * These are `id + name` rows, so a dedicated form screen per record would be
 * more clicks than content. Everything happens in place.
 */
const LookupTable = ({
  label,
  path,
  withLogo = false,
}: {
  label: string
  path: string
  withLogo?: boolean
}) => {
  const queryClient = useQueryClient()
  const { items, loading, error } = useAdminList<LookupRow>(path, 0, 100)
  const { create, update, remove } = useAdminMutations<LookupRow, LookupWrite>(path)

  const [newName, setNewName] = useState('')
  const [newLogo, setNewLogo] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const [editingLogo, setEditingLogo] = useState('')
  const [pendingDelete, setPendingDelete] = useState<LookupRow | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  // Dropdowns elsewhere read these through a different query key, so they need
  // refreshing too or a newly added tag will not appear in a form until reload.
  const refreshOptions = () =>
    queryClient.invalidateQueries({ queryKey: ['admin', path, 'options'] })

  // Sending image_url to a name-only table would be rejected, so it is only
  // included where it exists. An empty box clears the logo rather than skipping
  // it, which is how the user removes one.
  const payloadFor = (name: string, logo: string): LookupWrite => ({
    name: name.trim(),
    ...(withLogo ? { image_url: logo.trim() === '' ? null : logo.trim() } : {}),
  })

  const runAction = async (action: () => Promise<unknown>, fallback: string) => {
    setActionError(null)
    try {
      await action()
      await refreshOptions()
      return true
    } catch (caught) {
      setActionError(errorMessage(caught, fallback))
      return false
    }
  }

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (newName.trim() === '') return
    const ok = await runAction(
      () => create.mutateAsync(payloadFor(newName, newLogo)),
      `Could not add this ${label.toLowerCase()} entry.`,
    )
    if (ok) {
      setNewName('')
      setNewLogo('')
    }
  }

  const handleRename = async (id: number) => {
    if (editingName.trim() === '') return
    const ok = await runAction(
      () => update.mutateAsync({ id, payload: payloadFor(editingName, editingLogo) }),
      'Could not save this entry.',
    )
    if (ok) setEditingId(null)
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    const ok = await runAction(
      () => remove.mutateAsync(pendingDelete.id),
      // The API answers 409 when something still references the row, which is
      // the common case here and worth surfacing verbatim.
      'Could not delete this entry.',
    )
    if (ok) setPendingDelete(null)
  }

  return (
    <section className='flex flex-col gap-4 rounded-2xl border border-primary/20 bg-card p-6'>
      <div className='flex items-center justify-between gap-4'>
        <h2 className='text-lg'>{label}</h2>
        <span className='text-sm text-muted-foreground'>{items.length}</span>
      </div>

      {error && (
        <p role='alert' className='text-sm text-red-400'>
          {error}
        </p>
      )}
      {actionError && (
        <p role='alert' className='text-sm text-red-400'>
          {actionError}
        </p>
      )}

      {loading ? (
        <div className='h-24 animate-pulse rounded-lg bg-muted-foreground/10' />
      ) : (
        <ul className='flex flex-col gap-2'>
          {items.map((item) => (
            <li key={item.id} className='flex flex-col gap-2'>
              {editingId === item.id ? (
                <>
                  <div className='flex items-center gap-2'>
                    <input
                      value={editingName}
                      onChange={(event) => setEditingName(event.target.value)}
                      aria-label={`Rename ${item.name}`}
                      className='h-9 flex-1 rounded-lg border border-primary/30 bg-background px-2 text-sm outline-none focus-visible:border-accent'
                    />
                    <button
                      type='button'
                      onClick={() => handleRename(item.id)}
                      className='cursor-pointer rounded-lg bg-primary/20 px-3 py-1.5 text-sm hover:bg-primary/30'
                    >
                      Save
                    </button>
                    <button
                      type='button'
                      onClick={() => setEditingId(null)}
                      className='cursor-pointer rounded-lg px-3 py-1.5 text-sm text-muted-foreground outline-1 hover:text-foreground'
                    >
                      Cancel
                    </button>
                  </div>
                  {withLogo && (
                    <input
                      type='url'
                      value={editingLogo}
                      onChange={(event) => setEditingLogo(event.target.value)}
                      placeholder='Logo URL (leave empty for none)'
                      aria-label={`Logo URL for ${item.name}`}
                      className='h-9 rounded-lg border border-primary/30 bg-background px-2 text-sm outline-none focus-visible:border-accent'
                    />
                  )}
                </>
              ) : (
                <div className='flex items-center gap-2'>
                  {withLogo && <AcademyLogo name={item.name} imageUrl={item.image_url} />}
                  <span className='flex-1 text-sm'>{item.name}</span>
                  <button
                    type='button'
                    onClick={() => {
                      setEditingId(item.id)
                      setEditingName(item.name)
                      setEditingLogo(item.image_url ?? '')
                      setActionError(null)
                    }}
                    className='cursor-pointer rounded-lg px-3 py-1.5 text-sm outline-1 hover:bg-primary/10'
                  >
                    Rename
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setActionError(null)
                      setPendingDelete(item)
                    }}
                    className='cursor-pointer rounded-lg px-3 py-1.5 text-sm text-red-400 outline-1 outline-red-500/40 hover:bg-red-500/10'
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className='flex flex-col gap-2'>
        <div className='flex gap-2'>
          <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder={`Add a new ${label.toLowerCase().replace(/s$/, '')}`}
            aria-label={`New ${label} entry`}
            className='h-10 flex-1 rounded-lg border border-primary/30 bg-background px-3 text-sm outline-none focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent'
          />
          <button
            type='submit'
            disabled={newName.trim() === '' || create.isPending}
            className='cursor-pointer rounded-lg bg-primary/20 px-4 py-2 text-sm hover:bg-primary/30 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Add
          </button>
        </div>
        {withLogo && (
          <input
            type='url'
            value={newLogo}
            onChange={(event) => setNewLogo(event.target.value)}
            placeholder='Logo URL (optional)'
            aria-label={`New ${label} logo URL`}
            className='h-10 rounded-lg border border-primary/30 bg-background px-3 text-sm outline-none focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent'
          />
        )}
      </form>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete “${pendingDelete?.name ?? ''}”?`}
        message='If any project, course or certification still references it, the API will refuse.'
        busy={remove.isPending}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  )
}

const AdminLookupsPage = () => {
  useNoIndex('Lookups — Admin')

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-3xl'>Lookups</h1>
        <p className='mt-2 text-muted-foreground'>
          The shared vocabularies behind projects, courses and certifications.
        </p>
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        {TABLES.map((table) => (
          <LookupTable
            key={table.key}
            label={table.label}
            path={table.path}
            withLogo={'withLogo' in table && table.withLogo}
          />
        ))}
      </div>
    </div>
  )
}

export default AdminLookupsPage
