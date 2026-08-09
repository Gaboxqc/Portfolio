import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { Checkbox, Field, Select, TextInput } from '../../components/admin/FormField'
import TagPicker from '../../components/admin/TagPicker'
import TranslationEditor from '../../components/admin/TranslationEditor'
import { useAdminDetail, useAdminMutations } from '../../hooks/admin/useAdminResource'
import { useLanguages, useLookupOptions } from '../../hooks/admin/useLookupOptions'
import useNoIndex from '../../hooks/useNoIndex'
import { errorMessage } from '../../services/adminApi'
import { ADMIN_PATHS, type ProjectWrite } from '../../services/admin/resources'
import { syncTranslations, type TranslationDraft } from '../../services/admin/translations'
import { translationDraftsFor } from '../../utils/translationDrafts'
import type { FilterOption, Language, Project } from '../../types'

const PATH = ADMIN_PATHS.projects

interface Draft {
  year: string
  isMain: boolean
  projectTypeId: number | ''
  difficultyLevelId: number | ''
  imageUrl: string
  gitUrl: string
  deployUrl: string
  tagIds: number[]
}

/** Empty strings mean "no value", which the API expects as null rather than "". */
const orNull = (value: string) => (value.trim() === '' ? null : value.trim())

const draftFrom = (project: Project | undefined): Draft => ({
  year: String(project?.year ?? new Date().getFullYear()),
  isMain: project?.is_main ?? false,
  projectTypeId: project?.project_type?.id ?? '',
  difficultyLevelId: project?.difficulty_level?.id ?? '',
  imageUrl: project?.image_url ?? '',
  gitUrl: project?.git_url ?? '',
  deployUrl: project?.deploy_url ?? '',
  tagIds: project?.tags.map((tag) => tag.id) ?? [],
})

interface ProjectFormProps {
  project: Project | undefined
  languages: Language[]
  projectTypes: FilterOption[]
  difficultyLevels: FilterOption[]
  tags: FilterOption[]
}

/**
 * The form itself, mounted only once its data has arrived.
 *
 * Taking the record as a prop lets both state slices be seeded in `useState`
 * initialisers. Populating them from an effect instead would mean rendering once
 * with empty values and immediately setting state — the cascading-render pattern
 * that `react-hooks/set-state-in-effect` exists to catch.
 */
const ProjectForm = ({
  project,
  languages,
  projectTypes,
  difficultyLevels,
  tags,
}: ProjectFormProps) => {
  const navigate = useNavigate()
  const isNew = project === undefined
  const { create, update } = useAdminMutations<Project, ProjectWrite>(PATH)

  const [draft, setDraft] = useState<Draft>(() => draftFrom(project))
  const [translations, setTranslations] = useState<TranslationDraft[]>(() =>
    translationDraftsFor(languages, project?.translations),
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

    if (draft.projectTypeId === '' || draft.difficultyLevelId === '') {
      setError('Project type and difficulty level are both required.')
      return
    }

    const payload: ProjectWrite = {
      year: Number(draft.year),
      is_main: draft.isMain,
      project_type_id: draft.projectTypeId,
      difficulty_level_id: draft.difficultyLevelId,
      image_url: orNull(draft.imageUrl),
      git_url: orNull(draft.gitUrl),
      deploy_url: orNull(draft.deployUrl),
      tag_ids: draft.tagIds,
    }

    setSaving(true)
    try {
      // The record must exist before translations can hang off it, so the two
      // writes are ordered rather than concurrent.
      const saved = isNew
        ? await create.mutateAsync(payload)
        : await update.mutateAsync({ id: project.id, payload })

      await syncTranslations(PATH, saved.id, project?.translations ?? [], translations, true)
      navigate('/admin/projects')
    } catch (caught) {
      setError(errorMessage(caught, 'Could not save this project.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex max-w-3xl flex-col gap-8'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <h1 className='text-3xl'>{isNew ? 'New project' : 'Edit project'}</h1>
        <Link to='/admin/projects' className='text-sm text-muted-foreground hover:text-accent'>
          Back to projects
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

        <Field label='Project type' required>
          {(fieldId, describedBy) => (
            <Select
              id={fieldId}
              describedBy={describedBy}
              value={draft.projectTypeId}
              onChange={(projectTypeId) => setDraft({ ...draft, projectTypeId })}
              options={projectTypes}
            />
          )}
        </Field>

        <Field label='Difficulty level' required>
          {(fieldId, describedBy) => (
            <Select
              id={fieldId}
              describedBy={describedBy}
              value={draft.difficultyLevelId}
              onChange={(difficultyLevelId) => setDraft({ ...draft, difficultyLevelId })}
              options={difficultyLevels}
            />
          )}
        </Field>

        <Field label='Image URL' hint='Upload to your asset host, then paste the URL here.'>
          {(fieldId, describedBy) => (
            <TextInput
              id={fieldId}
              describedBy={describedBy}
              type='url'
              value={draft.imageUrl}
              onChange={(imageUrl) => setDraft({ ...draft, imageUrl })}
              placeholder='https://assets.example.com/project.png'
            />
          )}
        </Field>

        <Field label='Repository URL'>
          {(fieldId, describedBy) => (
            <TextInput
              id={fieldId}
              describedBy={describedBy}
              type='url'
              value={draft.gitUrl}
              onChange={(gitUrl) => setDraft({ ...draft, gitUrl })}
            />
          )}
        </Field>

        <Field label='Live URL'>
          {(fieldId, describedBy) => (
            <TextInput
              id={fieldId}
              describedBy={describedBy}
              type='url'
              value={draft.deployUrl}
              onChange={(deployUrl) => setDraft({ ...draft, deployUrl })}
            />
          )}
        </Field>
      </div>

      {draft.imageUrl.trim() !== '' && (
        <div className='flex flex-col gap-2'>
          <p className='text-sm text-muted-foreground'>Image preview</p>
          <img
            src={draft.imageUrl}
            alt=''
            className='max-h-48 w-fit rounded-xl border border-primary/20 object-cover'
          />
        </div>
      )}

      <Checkbox
        label='Featured project'
        checked={draft.isMain}
        onChange={(isMain) => setDraft({ ...draft, isMain })}
        hint='Featured projects appear in the highlighted section on the home page.'
      />

      <TagPicker label='Tags' available={tags} selected={draft.tagIds} onToggle={toggleTag} />

      <TranslationEditor
        languages={languages}
        drafts={translations}
        onChange={updateTranslation}
        withDescription
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
          {saving ? 'Saving…' : 'Save project'}
        </button>
        <Link
          to='/admin/projects'
          className='rounded-xl bg-primary/10 px-6 py-3 outline-1 hover:bg-primary/20'
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}

/** Loads everything the form needs, then hands it over as props. */
const ProjectFormPage = () => {
  const { id } = useParams<{ id: string }>()
  const isNew = id === 'new'

  useNoIndex(isNew ? 'New project — Admin' : 'Edit project — Admin')

  const { data: project, loading, error } = useAdminDetail<Project>(PATH, isNew ? undefined : id)
  const { options: projectTypes } = useLookupOptions(ADMIN_PATHS.projectTypes)
  const { options: difficultyLevels } = useLookupOptions(ADMIN_PATHS.difficultyLevels)
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
    <ProjectForm
      // Remounts with freshly seeded state when the edited record changes.
      key={project?.id ?? 'new'}
      project={project}
      languages={languages}
      projectTypes={projectTypes}
      difficultyLevels={difficultyLevels}
      tags={tags}
    />
  )
}

export default ProjectFormPage
