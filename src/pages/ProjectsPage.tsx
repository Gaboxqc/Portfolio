import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { SearchIcon } from '../assets/icons/index'
import PageHeader from '../components/ui/PageHeader'
import ResultsBar from '../components/ui/ResultsBar'
import FilterGroup from '../components/ui/FilterGroup'
import ProjectsContainer from '../components/containers/ProjectsContainer'
import useLanguage from '../hooks/useLanguage'
import useFilters from '../hooks/useFilters'
import useProjects from '../hooks/useProjects'
import useToggleArray from '../hooks/useToggleArray'

const ProjectsPage = () => {
  const { translate } = useLanguage()

  const { options: projectTypes } = useFilters('project_types')
  const { options: difficultyLevels } = useFilters('difficulty_levels')
  const { options: tags } = useFilters('tags')

  const [search, setSearch] = useState('')
  const [selectedTypes, toggleType, clearTypes] = useToggleArray()
  const [selectedDifficulties, toggleDifficulty, clearDifficulties] = useToggleArray()
  const [selectedTags, toggleTag, clearTags] = useToggleArray()

  const { projects, loading, error } = useProjects({
    typeIds: selectedTypes,
    difficultyIds: selectedDifficulties,
    tagIds: selectedTags,
    search,
  })

  const hasActiveFilters =
    selectedTypes.length > 0 ||
    selectedDifficulties.length > 0 ||
    selectedTags.length > 0 ||
    search.trim().length > 0

  const clearFilters = () => {
    clearTypes()
    clearDifficulties()
    clearTags()
    setSearch('')
  }

  return (
    <div className='container mx-auto mb-30 flex flex-col gap-8 px-4 pt-24'>
      <PageHeader
        backLabel={translate('course-section.back')}
        title={translate('project-section.title')}
        description={translate('project-section.description')}
      />

      <section className='flex flex-col gap-8'>
        <div className='flex h-12 w-full items-center rounded-xl border bg-background'>
          <SearchIcon className='mr-2 ml-3 h-5 w-5' />
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full p-2 text-muted-foreground outline-0'
            placeholder={translate('project-section.search')}
          />
        </div>

        <FilterGroup
          label={translate('project-section.type_filter')}
          items={projectTypes}
          selected={selectedTypes}
          onToggle={toggleType}
        />
        <FilterGroup
          label={translate('project-section.difficulty_filter')}
          items={difficultyLevels}
          selected={selectedDifficulties}
          onToggle={toggleDifficulty}
        />
        <FilterGroup
          label={translate('project-section.tag_filter')}
          items={tags}
          selected={selectedTags}
          onToggle={toggleTag}
        />

        <AnimatePresence mode='wait'>
          {hasActiveFilters && (
            <ResultsBar
              count={projects.length}
              label={translate('project-section.founded_projects')}
              clearLabel={translate('project-section.clean_filter')}
              onClear={clearFilters}
            />
          )}
        </AnimatePresence>
      </section>

      <section className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
        <ProjectsContainer projects={projects} loading={loading} error={error} />
      </section>
    </div>
  )
}

export default ProjectsPage
