import type { Translation } from '../types'

/**
 * Best available human label for a record in the admin lists.
 *
 * Prefers English, then anything else, then a placeholder — the admin needs a
 * row identifiable even when the record is half-translated, which is exactly the
 * state the dashboard exists to fix.
 */
export const adminLabel = (translations: Translation[] = []): string => {
  const preferred =
    translations.find((translation) => translation.language_code === 'en') ?? translations[0]
  return preferred?.title?.trim() || '(untitled)'
}
