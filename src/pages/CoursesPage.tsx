import CoursesContainer from '../components/containers/CoursesContainer'
import CertificationsContainer from '../components/containers/CertificationsContainer'
import FilterGroup from '../components/ui/FilterGroup'
import PageHeader from '../components/ui/PageHeader'
import ResultsBar from '../components/ui/ResultsBar'
import useLanguage from '../hooks/useLanguage'
import useFilters from '../hooks/useFilters'
import useCourses from '../hooks/useCourses'
import useToggleArray from '../hooks/useToggleArray'
import { AnimatePresence } from 'framer-motion'

const CoursesPage = () => {
  const { translate } = useLanguage()
  const { options: categories } = useFilters('categories')
  const { options: tags } = useFilters('tags')

  const [selectedCategories, toggleCategory, clearCategories] = useToggleArray()
  const [selectedTags, toggleTag, clearTags] = useToggleArray()

  const { courses, loading, error } = useCourses({
    categoryIds: selectedCategories,
    tagIds: selectedTags,
    limit: 100,
  })

  const hasActiveFilters = selectedCategories.length > 0 || selectedTags.length > 0

  const clearFilters = () => {
    clearCategories()
    clearTags()
  }

  return (
    <div className='container mx-auto mb-30 flex flex-col gap-8 px-4 pt-24'>
      <PageHeader
        backLabel={translate('course-section.back')}
        title={translate('course-section.title')}
        description={translate('course-section.description')}
      />

      <section className='flex flex-col gap-6'>
        <FilterGroup
          label={translate('course-section.category_filter')}
          items={categories}
          selected={selectedCategories}
          onToggle={toggleCategory}
        />
        <FilterGroup
          label={translate('course-section.tag_filter')}
          items={tags}
          selected={selectedTags}
          onToggle={toggleTag}
        />

        <AnimatePresence mode='wait'>
          {hasActiveFilters && (
            <ResultsBar
              count={courses.length}
              label={translate('course-section.founded_projects')}
              clearLabel={translate('course-section.clean_filter')}
              onClear={clearFilters}
            />
          )}
        </AnimatePresence>
      </section>

      {!hasActiveFilters && (
        <section className='flex flex-col gap-8'>
          <h3 className='text-2xl'>{translate('course-section.main_certification')}</h3>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            <CertificationsContainer isMain={true} animation='rise' />
          </div>
        </section>
      )}

      <section className='my-8 flex flex-col gap-8'>
        <h3 className='text-2xl'>
          {translate('course-section.all_courses')}{' '}
          <span className={'text-sm text-muted-foreground'}>{courses.length}</span>
        </h3>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          <CoursesContainer courses={courses} loading={loading} error={error} />
        </div>
      </section>
    </div>
  )
}

export default CoursesPage
