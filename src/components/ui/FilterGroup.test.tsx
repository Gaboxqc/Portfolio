import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import FilterGroup from '@/components/ui/FilterGroup'
import LanguageProvider from '@/context/LanguageContext'

const items = [
  { id: 1, name: 'Web' },
  { id: 2, name: 'Mobile' },
]

const renderGroup = (props: Partial<React.ComponentProps<typeof FilterGroup>> = {}) =>
  render(
    <LanguageProvider>
      <FilterGroup
        label='Filter by type'
        items={items}
        selected={[]}
        onToggle={() => {}}
        {...props}
      />
    </LanguageProvider>,
  )

describe('FilterGroup', () => {
  it('renders nothing when there are no items', () => {
    const { container } = renderGroup({ items: [] })
    expect(container).toBeEmptyDOMElement()
  })

  it('exposes the group with its label', () => {
    renderGroup()
    expect(screen.getByRole('group', { name: 'Filter by type' })).toBeInTheDocument()
  })

  // The selected state must not be conveyed by colour alone.
  it('marks only the selected chips as pressed', () => {
    renderGroup({ selected: [2] })
    expect(screen.getByRole('button', { name: 'Web' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Mobile' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('reports the toggled id', async () => {
    const onToggle = vi.fn()
    renderGroup({ onToggle })
    screen.getByRole('button', { name: 'Web' }).click()
    expect(onToggle).toHaveBeenCalledWith(1)
  })
})
