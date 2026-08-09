import CourseCard from '../cards/CourseCard'
import AsyncCollection from '../ui/AsyncCollection'
import useLanguage from '../../hooks/useLanguage'
import getTranslation from '../../utils/getTranslation'
import type { Course } from '../../types'

interface CoursesContainerProps {
  courses?: Course[]
  loading?: boolean
  error?: string | null
}

function CoursesContainer({ courses = [], loading = false, error = null }: CoursesContainerProps) {
  const { locale } = useLanguage()

  return (
    <AsyncCollection items={courses} loading={loading} error={error} emptyKey='state.no-courses'>
      {(course) => {
        const translation = getTranslation(course.translations, locale)
        return (
          <CourseCard
            title={translation.title}
            year={course.year}
            academy={course.academy?.name ?? ''}
            url={course.url}
            tags={course.tags}
          />
        )
      }}
    </AsyncCollection>
  )
}

export default CoursesContainer
