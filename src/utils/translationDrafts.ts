import type { TranslationDraft } from '../services/admin/translations'
import type { Language, Translation } from '../types'

/**
 * One editable draft per configured language, pre-filled from what exists.
 *
 * Driven by the API's language table rather than a hardcoded list, so adding a
 * language server-side surfaces in the forms without a frontend change.
 */
export const translationDraftsFor = (
  languages: Language[],
  existing: Translation[] = [],
): TranslationDraft[] =>
  languages.map((language) => {
    const match = existing.find((translation) => translation.language_code === language.code)
    return {
      language_code: language.code,
      title: match?.title ?? '',
      description: match?.description ?? '',
    }
  })
