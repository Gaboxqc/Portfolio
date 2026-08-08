import { useId } from 'react'
import Badge from './Badge'
import type { FilterOption } from '../../types'

interface FilterGroupProps {
  label: string
  items?: FilterOption[]
  selected?: number[]
  onToggle: (id: number) => void
}

function FilterGroup({ label, items = [], selected = [], onToggle }: FilterGroupProps) {
  const labelId = useId()

  if (!items.length) return null

  return (
    <div role='group' aria-labelledby={labelId}>
      <p id={labelId} className='mb-2 text-muted-foreground'>
        {label}
      </p>
      <div className='flex flex-wrap gap-2'>
        {items.map((item) => (
          <button
            key={item.id}
            type='button'
            // Conveys the toggle state to screen readers, which colour alone cannot.
            aria-pressed={selected.includes(item.id)}
            onClick={() => onToggle(item.id)}
            className='cursor-pointer rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
          >
            <Badge variant='filter' text={item.name} isActive={selected.includes(item.id)} />
          </button>
        ))}
      </div>
    </div>
  )
}

export default FilterGroup
