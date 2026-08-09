import { useId, type ReactNode } from 'react'

const CONTROL_STYLES =
  'h-11 w-full rounded-xl border border-primary/30 bg-background px-3 outline-none focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent'

interface FieldProps {
  label: string
  hint?: string
  required?: boolean
  /** Renders the control; receives the id to bind the label to. */
  children: (id: string, describedBy: string | undefined) => ReactNode
}

/**
 * Label + control + hint, with the ids wired up.
 *
 * A generated id keeps every control properly labelled without hand-maintained
 * unique strings, which is where `htmlFor` bindings usually rot.
 */
export const Field = ({ label, hint, required = false, children }: FieldProps) => {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined

  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor={id} className='text-sm text-muted-foreground'>
        {label}
        {required && (
          <span aria-hidden='true' className='ml-1 text-accent'>
            *
          </span>
        )}
      </label>
      {children(id, hintId)}
      {hint && (
        <p id={hintId} className='text-xs text-muted-foreground/70'>
          {hint}
        </p>
      )}
    </div>
  )
}

interface TextInputProps {
  id: string
  describedBy?: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'url' | 'number'
  placeholder?: string
  required?: boolean
}

export const TextInput = ({
  id,
  describedBy,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
}: TextInputProps) => (
  <input
    id={id}
    aria-describedby={describedBy}
    type={type}
    value={value}
    placeholder={placeholder}
    required={required}
    onChange={(event) => onChange(event.target.value)}
    className={CONTROL_STYLES}
  />
)

interface TextAreaProps {
  id: string
  describedBy?: string
  value: string
  onChange: (value: string) => void
  rows?: number
}

export const TextArea = ({ id, describedBy, value, onChange, rows = 4 }: TextAreaProps) => (
  <textarea
    id={id}
    aria-describedby={describedBy}
    value={value}
    rows={rows}
    onChange={(event) => onChange(event.target.value)}
    className='w-full rounded-xl border border-primary/30 bg-background p-3 outline-none focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent'
  />
)

interface SelectProps {
  id: string
  describedBy?: string
  value: number | ''
  onChange: (value: number | '') => void
  options: { id: number; name: string }[]
  placeholder?: string
}

export const Select = ({
  id,
  describedBy,
  value,
  onChange,
  options,
  placeholder = 'Select…',
}: SelectProps) => (
  <select
    id={id}
    aria-describedby={describedBy}
    value={value}
    onChange={(event) => onChange(event.target.value === '' ? '' : Number(event.target.value))}
    className={`${CONTROL_STYLES} cursor-pointer`}
  >
    <option value=''>{placeholder}</option>
    {options.map((option) => (
      <option key={option.id} value={option.id}>
        {option.name}
      </option>
    ))}
  </select>
)

interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  hint?: string
}

export const Checkbox = ({ label, checked, onChange, hint }: CheckboxProps) => {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex items-center gap-3'>
        <input
          id={id}
          type='checkbox'
          checked={checked}
          aria-describedby={hintId}
          onChange={(event) => onChange(event.target.checked)}
          className='h-4 w-4 cursor-pointer accent-accent'
        />
        <label htmlFor={id} className='cursor-pointer text-sm'>
          {label}
        </label>
      </div>
      {hint && (
        <p id={hintId} className='ml-7 text-xs text-muted-foreground/70'>
          {hint}
        </p>
      )}
    </div>
  )
}
