import { adminApi } from '../adminApi'
import type { Translation } from '../../types'

/**
 * Translations are a sub-resource keyed by (parent id, language code), with no
 * bulk endpoint — each language is its own POST, PATCH or DELETE. The form edits
 * them as one block, so the difference between what exists and what the user
 * wants has to be turned into individual writes.
 */

export interface TranslationDraft {
  language_code: string
  title: string
  description: string
}

export interface TranslationPlan {
  create: TranslationDraft[]
  update: TranslationDraft[]
  remove: string[]
}

/** A language the user left blank should not be written at all. */
const isFilled = (draft: TranslationDraft, withDescription: boolean) =>
  draft.title.trim().length > 0 && (!withDescription || draft.description.trim().length > 0)

const sameContent = (draft: TranslationDraft, existing: Translation, withDescription: boolean) =>
  draft.title.trim() === existing.title &&
  (!withDescription || draft.description.trim() === (existing.description ?? ''))

/**
 * Works out the minimal set of writes to turn `existing` into `drafts`.
 *
 * Pure and separately tested, because getting it wrong silently loses content:
 * an over-eager delete would drop a translation the user never touched.
 */
export const planTranslationWrites = (
  existing: Translation[],
  drafts: TranslationDraft[],
  withDescription: boolean,
): TranslationPlan => {
  const byLanguage = new Map(
    existing.map((translation) => [translation.language_code, translation]),
  )
  const plan: TranslationPlan = { create: [], update: [], remove: [] }

  for (const draft of drafts) {
    const current = byLanguage.get(draft.language_code)

    if (!isFilled(draft, withDescription)) {
      // Cleared by the user — remove it, but only if it was there to begin with.
      if (current) plan.remove.push(draft.language_code)
      continue
    }

    if (!current) {
      plan.create.push(draft)
    } else if (!sameContent(draft, current, withDescription)) {
      // Skipping unchanged languages keeps an edit from touching all three rows.
      plan.update.push(draft)
    }
  }

  return plan
}

const body = (draft: TranslationDraft, withDescription: boolean) =>
  withDescription
    ? { title: draft.title.trim(), description: draft.description.trim() }
    : { title: draft.title.trim() }

/** Applies a plan. Writes run in sequence so a failure reports the language that broke. */
export const syncTranslations = async (
  basePath: string,
  parentId: number,
  existing: Translation[],
  drafts: TranslationDraft[],
  withDescription: boolean,
): Promise<void> => {
  const plan = planTranslationWrites(existing, drafts, withDescription)
  const root = `${basePath}/${parentId}/translations`

  for (const draft of plan.create) {
    await adminApi.post(root, {
      language_code: draft.language_code,
      ...body(draft, withDescription),
    })
  }
  for (const draft of plan.update) {
    await adminApi.patch(`${root}/${draft.language_code}`, body(draft, withDescription))
  }
  for (const languageCode of plan.remove) {
    await adminApi.delete(`${root}/${languageCode}`)
  }
}
