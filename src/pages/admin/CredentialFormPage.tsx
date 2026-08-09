import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { Checkbox, Field, Select, TextInput } from '../../components/admin/FormField'
import TagPicker from '../../components/admin/TagPicker'
import TranslationEditor from '../../components/admin/TranslationEditor'
import { useAdminDetail, useAdminMutations } from '../../hooks/admin/useAdminResource'
import { useLanguages, useLookupOptions } from '../../hooks/admin/useLookupOptions'
import useNoIndex from '../../hooks/useNoIndex'
import { errorMessage } from '../../services/adminApi'
import { ADMIN_PATHS, type CredentialWrite } from '../../services/admin/resources'
import { syncTranslations, type TranslationDraft } from '../../services/admin/translations'
import { translationDraftsFor } from '../../utils/translationDrafts'
import type { Credential, FilterOption, Language } from '../../types'

/**
 * Shared form for courses and certifications.
 *
 * The API returns them from an identical schema; only two things differ — a
 * certification also carries `validation_serial` and an `is_main` flag. One
 * component with a `kind` beats two files that would drift apart.
 */
type CredentialKind = 'course' | 'certification'

interface Draft {
  year: string
  isMain: boolean
  url: string
  validationSerial: string
  academyId: number | ''
  categoryId: number | ''
  tagIds: number[]
}

const orNull = (value: string) => (value.trim() === '' ? null : value.trim())

const draftFrom = (record: Credential | undefined): Draft => ({
  year: String(record?.year ?? new Date().getFullYear()),
  isMain: record?.is_main ?? false,
  url: record?.url ?? '',
  validationSerial: record?.validation_serial ?? '',
  academyId: record?.academy?.id ?? '',
  categoryId: record?.category?.id ?? '',
  tagIds: record?.tags.map((tag) => tag.id) ?? [],
})

interface CredentialFormProps {
  kind: CredentialKind
  record: Credential | undefined
  languages: Language[]
  academies: FilterOption[]
  categories: FilterOption[]
  tags: FilterOption[]
}

const CredentialForm = ({
  kind,
  record,
  languages,
  academies,
  categories,
  tags,
}: CredentialFormProps) => {
  const isCertification = kind === 'certification'
  const path = isCertification ? ADMIN_PATHS.certifications : ADMIN_PATHS.courses
  const routeBase = isCertification ? '/admin/certifications' : '/admin/courses'
  const noun = isCertification ? 'certification' : 'course'

  const navigate = useNavigate()
  const isNew = record === undefined
  const { create, update } = useAdminMutations<Credential, CredentialWrite>(path)

  const [draft, setDraft] = useState<Draft>(() => draftFrom(record))
  const [translations, setTranslations] = useState<TranslationDraft[]>(() =>
    translationDraftsFor(languages, record?.translations),
  )
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const updateTranslation = (languageCode: string, patch: Partial<TranslationDraft>) =>
    setTranslations((previous) =>
      previous.map((entry) =>
        entry.language_code === languageCode ? { ...entry, ...patch } : entry,
      ),
    )

  const toggleTag = (tagId: number) =>
    setDraft((previous) => ({
      ...previous,
      tagIds: previous.tagIds.includes(tagId)
        ? previous.tagIds.filter((value) => value !== tagId)
        : [...previous.tagIds, tagId],
    }))

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (draft.academyId === '' || draft.categoryId === '') {
      setError('Academy and category are both required.')
      return
    }

    const payload: CredentialWrite = {
      year: Number(draft.year),
      is_main: draft.isMain,
      url: orNull(draft.url),
      academy_id: draft.academyId,
      category_id: draft.categoryId,
      tag_ids: draft.tagIds,
      ...(isCertification ? { validation_serial: orNull(draft.validationSerial) } : {}),
    }

    setSaving(true)
    try {
      const saved = isNew
        ? await create.mutateAsync(payload)
        : await update.mutateAsync({ id: record.id, payload })

      // Course and certification translations are title-only.
      await syncTranslations(path, saved.id, record?.translations ?? [], translations, false)
      navigate(routeBase)
    } catch (caught) {
      setError(errorMessage(caught, `Could not save this ${noun}.`))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex max-w-3xl flex-col gap-8'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <h1 className='text-3xl'>
          {isNew ? 'New' : 'Edit'} {noun}
        </h1>
        <Link to={routeBase} className='text-sm text-muted-foreground hover:text-accent'>
          Back to {noun}s
        </Link>
      </div>

      <div className='grid gap-5 md:grid-cols-2'>
        <Field label='Year' required>
          {(fieldId, describedBy) => (
            <TextInput
              id={fieldId}
              describedBy={describedBy}
              type='number'
              value={draft.year}
              onChange={(year) => setDraft({ ...draft, year })}
              required
            />
          )}
        </Field>

        <Field label='Academy' required>
          {(fieldId, describedBy) => (
            <Select
              id={fieldId}
              describedBy={describedBy}
              value={draft.academyId}
              onChange={(academyId) => setDraft({ ...draft, academyId })}
              options={academies}
            />
          )}
        </Field>

        <Field label='Category' required>
          {(fieldId, describedBy) => (
            <Select
              id={fieldId}
              describedBy={describedBy}
              value={draft.categoryId}
              onChange={(categoryId) => setDraft({ ...draft, categoryId })}
              options={categories}
            />
          )}
        </Field>

        <Field label='Certificate URL'>
          {(fieldId, describedBy) => (
            <TextInput
              id={fieldId}
              describedBy={describedBy}
              type='url'
              value={draft.url}
              onChange={(url) => setDraft({ ...draft, url })}
            />
          )}
        </Field>

        {isCertification && (
          <Field label='Validation serial' hint='The verification code printed on the certificate.'>
            {(fieldId, describedBy) => (
              <TextInput
                id={fieldId}
                describedBy={describedBy}
                value={draft.validationSerial}
                onChange={(validationSerial) => setDraft({ ...draft, validationSerial })}
              />
            )}
          </Field>
        )}
      </div>

      {isCertification && (
        <Checkbox
          label='Featured certification'
          checked={draft.isMain}
          onChange={(isMain) => setDraft({ ...draft, isMain })}
          hint='Featured certifications appear in the highlighted section on the courses page.'
        />
      )}

      <TagPicker label='Tags' available={tags} selected={draft.tagIds} onToggle={toggleTag} />

      <TranslationEditor
        languages={languages}
        drafts={translations}
        onChange={updateTranslation}
        withDescription={false}
      />

      {error && (
        <p role='alert' className='text-sm text-red-400'>
          {error}
        </p>
      )}

      <div className='flex gap-3'>
        <button
          type='submit'
          disabled={saving}
          className='cursor-pointer rounded-xl bg-linear-to-r from-primary to-accent px-6 py-3 font-medium text-white disabled:opacity-50'
        >
          {saving ? 'Saving…' : `Save ${noun}`}
        </button>
        <Link
          to={routeBase}
          className='rounded-xl bg-primary/10 px-6 py-3 outline-1 hover:bg-primary/20'
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}

interface CredentialFormPageProps {
  kind: CredentialKind
}

const CredentialFormPage = ({ kind }: CredentialFormPageProps) => {
  const path = kind === 'certification' ? ADMIN_PATHS.certifications : ADMIN_PATHS.courses
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'

  useNoIndex(`${isNew ? 'New' : 'Edit'} ${kind} — Admin`)

  const { data: record, loading, error } = useAdminDetail<Credential>(path, isNew ? undefined : id)
  const { options: academies } = useLookupOptions(ADMIN_PATHS.academies)
  const { options: categories } = useLookupOptions(ADMIN_PATHS.categories)
  const { options: tags } = useLookupOptions(ADMIN_PATHS.tags)
  const { languages, loading: loadingLanguages } = useLanguages()

  if ((!isNew && loading) || loadingLanguages) {
    return <p className='text-muted-foreground'>Loading…</p>
  }

  if (error) {
    return (
      <p role='alert' className='text-red-400'>
        {error}
      </p>
    )
  }

  return (
    <CredentialForm
      key={record?.id ?? 'new'}
      kind={kind}
      record={record}
      languages={languages}
      academies={academies}
      categories={categories}
      tags={tags}
    />
  )
}

export default CredentialFormPage
