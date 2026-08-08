import { describe, expect, it } from 'vitest'
import getTranslation from '@/utils/getTranslation'
import type { Translation } from '@/types'

const es: Translation = { language_code: 'es', title: 'Titulo', description: 'Descripcion' }
const en: Translation = { language_code: 'en', title: 'Title', description: 'Description' }
const de: Translation = { language_code: 'de', title: 'Titel', description: 'Beschreibung' }

describe('getTranslation', () => {
  it('returns the entry matching the requested locale', () => {
    expect(getTranslation([es, en, de], 'de')).toBe(de)
  })

  it('falls back to English when the locale is missing', () => {
    expect(getTranslation([es, en], 'de')).toBe(en)
  })

  it('falls back to the first entry when neither the locale nor English exist', () => {
    expect(getTranslation([es], 'de')).toBe(es)
  })

  // Regression: an empty array previously returned undefined through an unsound
  // `as Translation` cast, crashing consumers on `.title`.
  it('returns a blank translation instead of undefined for an empty list', () => {
    const result = getTranslation([], 'es')
    expect(result).toBeDefined()
    expect(result.title).toBe('')
    expect(result.description).toBe('')
  })

  it('handles a missing translations argument', () => {
    expect(getTranslation(undefined, 'es').title).toBe('')
  })
})
