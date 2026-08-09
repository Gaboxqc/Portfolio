import { useEffect, useId, useRef } from 'react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  busy?: boolean
  error?: string | null
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Confirmation for destructive actions, built on the native `<dialog>`.
 *
 * `showModal()` gives focus trapping, Escape-to-close and an inert background
 * for free — all things a hand-rolled overlay usually gets wrong.
 */
const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  busy = false,
  error = null,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  // A generated id, because several of these can share a page — the lookups
  // screen renders one per table, and a hardcoded id would make every
  // aria-labelledby point at the first dialog's heading.
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      // Escape fires `cancel`; routing it through onCancel keeps React's state
      // in step with the dialog's own.
      onCancel={(event) => {
        event.preventDefault()
        if (!busy) onCancel()
      }}
      aria-labelledby={titleId}
      className='max-w-sm rounded-2xl border border-primary/30 bg-card p-6 text-foreground backdrop:bg-black/60'
    >
      <h2 id={titleId} className='text-lg'>
        {title}
      </h2>
      <p className='mt-2 text-sm text-muted-foreground'>{message}</p>

      {error && (
        <p role='alert' className='mt-3 text-sm text-red-400'>
          {error}
        </p>
      )}

      <div className='mt-6 flex justify-end gap-3'>
        <button
          type='button'
          onClick={onCancel}
          disabled={busy}
          className='cursor-pointer rounded-lg bg-primary/10 px-4 py-2 text-sm outline-1 hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50'
        >
          Cancel
        </button>
        <button
          type='button'
          onClick={onConfirm}
          disabled={busy}
          className='cursor-pointer rounded-lg bg-red-500/80 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50'
        >
          {busy ? 'Deleting…' : confirmLabel}
        </button>
      </div>
    </dialog>
  )
}

export default ConfirmDialog
