import { useId } from 'react'

import type { Tag } from '../../types'

interface TagPickerProps {
  label: string
  available: Tag[]
  selected: number[]
  onToggle: (id: number) => void
}

/**
 * Multi-select for tags, as a group of toggle buttons.
 *
 * A native `<select multiple>` is notoriously awkward — ctrl-clicking to
 * deselect loses the whole selection on a mis-click. Toggle buttons carry their
 * state in `aria-pressed`, so the selection is announced rather than only
 * coloured, matching the public site's filter chips.
 */
const TagPicker = ({ label, available, selected, onToggle }: TagPickerProps) => {
  const labelId = useId()

  return (
    <div role='group' aria-labelledby={labelId} className='flex flex-col gap-2'>
      <p id={labelId} className='text-sm text-muted-foreground'>
        {label}
      </p>

      {available.length === 0 ? (
        <p className='text-xs text-muted-foreground/70'>
          No tags exist yet. Create some under Lookups first.
        </p>
      ) : (
        <div className='flex flex-wrap gap-2'>
          {available.map((tag) => {
            const isSelected = selected.includes(tag.id)
            return (
              <button
                key={tag.id}
                type='button'
                aria-pressed={isSelected}
                onClick={() => onToggle(tag.id)}
                className={`cursor-pointer rounded-xl border px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  isSelected
                    ? 'border-accent/60 bg-primary/20 text-foreground'
                    : 'border-primary/20 text-muted-foreground hover:border-primary/40'
                }`}
              >
                {tag.name}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TagPicker
