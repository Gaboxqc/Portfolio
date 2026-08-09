import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import AcademyLogo from '@/components/ui/AcademyLogo'

describe('AcademyLogo', () => {
  it('renders the logo when the academy has one', () => {
    render(<AcademyLogo name='Platzi' imageUrl='https://assets.example.com/platzi.png' />)
    const image = screen.getByRole('presentation', { hidden: true })
    expect(image).toHaveAttribute('src', 'https://assets.example.com/platzi.png')
  })

  // The name is already printed on the card, so repeating it would be announced
  // twice by a screen reader.
  it('leaves the image decorative', () => {
    render(<AcademyLogo name='Platzi' imageUrl='https://assets.example.com/platzi.png' />)
    expect(screen.queryByRole('img', { name: 'Platzi' })).not.toBeInTheDocument()
  })

  // Falling back to another academy's icon — as both cards used to — is worse
  // than showing no logo at all.
  it('falls back to the initial when no logo is set', () => {
    const { container } = render(<AcademyLogo name='Coursera' />)
    expect(container.querySelector('img')).toBeNull()
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it.each([null, undefined, ''])('treats %p as no logo', (value) => {
    const { container } = render(<AcademyLogo name='edX' imageUrl={value} />)
    expect(container.querySelector('img')).toBeNull()
    expect(screen.getByText('E')).toBeInTheDocument()
  })

  it('does not crash on a blank academy name', () => {
    render(<AcademyLogo name='   ' />)
    expect(screen.getByText('?')).toBeInTheDocument()
  })
})
