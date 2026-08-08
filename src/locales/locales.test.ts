import { describe, expect, it } from 'vitest'
import es from '@/locales/es.json'
import en from '@/locales/en.json'
import de from '@/locales/de.json'

type Dictionary = Record<string, unknown>

const flatten = (dictionary: Dictionary, prefix = ''): string[] =>
  Object.entries(dictionary).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return value !== null && typeof value === 'object' ? flatten(value as Dictionary, path) : [path]
  })

const dictionaries = { es, en, de }

describe('locale files', () => {
  // Regression: de.json shipped `footer.course` while the Footer reads
  // `footer.courses`, so the German footer rendered the raw key path.
  it('define exactly the same keys in every language', () => {
    const keys = Object.entries(dictionaries).map(
      ([locale, dictionary]) => [locale, new Set(flatten(dictionary as Dictionary))] as const,
    )
    const everyKey = new Set(keys.flatMap(([, set]) => [...set]))

    const missing = keys.flatMap(([locale, set]) =>
      [...everyKey].filter((key) => !set.has(key)).map((key) => `${locale} is missing ${key}`),
    )

    expect(missing).toEqual([])
  })

  it('have no blank values', () => {
    for (const [locale, dictionary] of Object.entries(dictionaries)) {
      const blanks = flatten(dictionary as Dictionary).filter((path) => {
        const value = path
          .split('.')
          .reduce<unknown>((obj, key) => (obj as Dictionary)?.[key], dictionary)
        return typeof value !== 'string' || value.trim() === ''
      })
      expect(blanks, `${locale} has blank values`).toEqual([])
    }
  })
})
