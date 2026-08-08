import { describe, expect, it } from 'vitest'
import { getDifficultyStyle } from '@/utils/difficultyLevelStyles'
import { getProjectTypeStyle } from '@/utils/projectTypeStyles'

describe('getDifficultyStyle', () => {
  it('maps a known level regardless of casing', () => {
    expect(getDifficultyStyle('Junior')).toBe(getDifficultyStyle('junior'))
    expect(getDifficultyStyle('junior')).toContain('green')
  })

  it('falls back for an unknown level', () => {
    expect(getDifficultyStyle('wizard')).toContain('muted-foreground')
  })

  it('falls back for a missing level', () => {
    expect(getDifficultyStyle()).toContain('muted-foreground')
  })
})

describe('getProjectTypeStyle', () => {
  it('is stable for the same name', () => {
    expect(getProjectTypeStyle('Web')).toBe(getProjectTypeStyle('Web'))
  })

  it('ignores casing', () => {
    expect(getProjectTypeStyle('WEB')).toBe(getProjectTypeStyle('web'))
  })

  it('always returns a class for any input', () => {
    for (const name of ['', 'a', 'enterprise tooling', 'ñ']) {
      expect(getProjectTypeStyle(name)).toMatch(/border-\w+-400 text-\w+-400/)
    }
  })
})
