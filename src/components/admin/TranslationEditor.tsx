import { Field, TextArea, TextInput } from './FormField'
import type { Language } from '../../types'
import type { TranslationDraft } from '../../services/admin/translations'

interface TranslationEditorProps {
  languages: Language[]
  drafts: TranslationDraft[]
  onChange: (languageCode: string, patch: Partial<TranslationDraft>) => void
  /** Projects carry a description; courses and certifications are title-only. */
  withDescription: boolean
}

/**
 * Per-language content, edited as one block.
 *
 * Languages come from the API's own table rather than a hardcoded list, so
 * adding one server-side surfaces here without a frontend change. A language
 * left blank is simply not written — and if it existed before, it is removed.
 */
const TranslationEditor = ({
  languages,
  drafts,
  onChange,
  withDescription,
}: TranslationEditorProps) => {
  if (languages.length === 0) {
    return (
      <p className='text-sm text-muted-foreground'>
        No languages are configured. Add them under Lookups first.
      </p>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h2 className='text-lg'>Translations</h2>
        <p className='text-sm text-muted-foreground'>
          Leave a language empty to skip it. Clearing one that already exists deletes it.
        </p>
      </div>

      {languages.map((language) => {
        const draft =
          drafts.find((entry) => entry.language_code === language.code) ??
          ({ language_code: language.code, title: '', description: '' } as TranslationDraft)

        return (
          <fieldset
            key={language.code}
            className='flex flex-col gap-4 rounded-xl border border-primary/20 p-4'
          >
            <legend className='px-2 text-sm text-muted-foreground'>
              {language.name} ({language.code})
            </legend>

            <Field label='Title'>
              {(id, describedBy) => (
                <TextInput
                  id={id}
                  describedBy={describedBy}
                  value={draft.title}
                  onChange={(title) => onChange(language.code, { title })}
                />
              )}
            </Field>

            {withDescription && (
              <Field label='Description'>
                {(id, describedBy) => (
                  <TextArea
                    id={id}
                    describedBy={describedBy}
                    value={draft.description}
                    onChange={(description) => onChange(language.code, { description })}
                  />
                )}
              </Field>
            )}
          </fieldset>
        )
      })}
    </div>
  )
}

export default TranslationEditor
