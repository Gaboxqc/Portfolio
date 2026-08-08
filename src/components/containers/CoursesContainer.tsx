import CourseCard from '../cards/CourseCard'
import useLanguage from '../../hooks/useLanguage'
import getTranslation from '../../utils/getTranslation'
import { motion } from 'framer-motion'
import type { Course } from '../../types'

interface CoursesContainerProps {
  courses?: Course[]
  loading?: boolean
  error?: string | null
}

function CoursesContainer({ courses = [], loading = false, error = null }: CoursesContainerProps) {
  const { locale, translate } = useLanguage()

  if (loading)
    return (
      <>
        {[...Array(4)].map((_, i) => (
          <div key={i} className='h-40 w-full animate-pulse rounded-xl bg-muted-foreground/10' />
        ))}
      </>
    )

  if (error)
    return (
      <p role='alert' className='col-span-full p-10 text-center text-red-500'>
        {translate('state.error')}
      </p>
    )

  if (!courses.length)
    return (
      <p className='col-span-full p-10 text-center text-muted-foreground'>
        {translate('state.no-courses')}
      </p>
    )

  return (
    <>
      {courses.map((course) => {
        const translation = getTranslation(course.translations, locale)
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' }}
            viewport={{ once: true }}
            key={course.id}
          >
            <CourseCard
              title={translation.title}
              year={course.year}
              academy={course.academy.name}
              url={course.url}
              tags={course.tags}
            />
          </motion.div>
        )
      })}
    </>
  )
}

export default CoursesContainer
