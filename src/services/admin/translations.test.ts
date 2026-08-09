import { describe, expect, it } from 'vitest'

import { planTranslationWrites } from '@/services/admin/translations'
import type { Translation } from '@/types'

const draft = (code: string, title: string, description = '') => ({
  language_code: code,
  title,
  description,
})

const existing = (code: string, title: string, description?: string): Translation => ({
  language_code: code,
  title,
  ...(description === undefined ? {} : { description }),
})

describe('planTranslationWrites', () => {
  it('creates a language that does not exist yet', () => {
    const plan = planTranslationWrites([], [draft('en', 'Title', 'Body')], true)
    expect(plan.create.map((entry) => entry.language_code)).toEqual(['en'])
    expect(plan.update).toEqual([])
    expect(plan.remove).toEqual([])
  })

  it('updates a language whose content changed', () => {
    const plan = planTranslationWrites(
      [existing('en', 'Old', 'Body')],
      [draft('en', 'New', 'Body')],
      true,
    )
    expect(plan.update.map((entry) => entry.title)).toEqual(['New'])
    expect(plan.create).toEqual([])
  })

  // Without this an edit would rewrite all three languages on every save.
  it('leaves an unchanged language completely alone', () => {
    const plan = planTranslationWrites(
      [existing('en', 'Same', 'Body')],
      [draft('en', 'Same', 'Body')],
      true,
    )
    expect(plan).toEqual({ create: [], update: [], remove: [] })
  })

  it('ignores surrounding whitespace when deciding if something changed', () => {
    const plan = planTranslationWrites(
      [existing('en', 'Same', 'Body')],
      [draft('en', '  Same  ', '  Body  ')],
      true,
    )
    expect(plan.update).toEqual([])
  })

  it('removes a language the user cleared', () => {
    const plan = planTranslationWrites([existing('de', 'Titel', 'Text')], [draft('de', '')], true)
    expect(plan.remove).toEqual(['de'])
    expect(plan.create).toEqual([])
  })

  // The dangerous case: a blank language that never existed must not produce a
  // DELETE, which would 404 and fail an otherwise valid save.
  it('does not try to remove a language that was never there', () => {
    const plan = planTranslationWrites([], [draft('de', ''), draft('en', 'Title', 'Body')], true)
    expect(plan.remove).toEqual([])
    expect(plan.create.map((entry) => entry.language_code)).toEqual(['en'])
  })

  it('treats a missing description as incomplete when descriptions are required', () => {
    const plan = planTranslationWrites([], [draft('en', 'Title', '')], true)
    expect(plan.create).toEqual([])
  })

  it('accepts a title-only draft when descriptions are not used', () => {
    const plan = planTranslationWrites([], [draft('en', 'Title', '')], false)
    expect(plan.create.map((entry) => entry.language_code)).toEqual(['en'])
  })

  it('ignores description differences for title-only resources', () => {
    const plan = planTranslationWrites(
      [existing('en', 'Title')],
      [draft('en', 'Title', 'ignored')],
      false,
    )
    expect(plan.update).toEqual([])
  })

  it('handles several languages at once', () => {
    const plan = planTranslationWrites(
      [existing('en', 'Keep', 'Body'), existing('es', 'Old', 'Cuerpo'), existing('de', 'Bye', 'X')],
      [draft('en', 'Keep', 'Body'), draft('es', 'New', 'Cuerpo'), draft('de', '')],
      true,
    )
    expect(plan.create).toEqual([])
    expect(plan.update.map((entry) => entry.language_code)).toEqual(['es'])
    expect(plan.remove).toEqual(['de'])
  })
})
