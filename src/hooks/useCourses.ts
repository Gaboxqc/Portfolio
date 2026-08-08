import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getCourses } from '../services/courses'
import type { Course } from '../types'

interface UseCoursesParams {
  categoryIds?: number[]
  tagIds?: number[]
  limit?: number
}

const useCourses = ({ categoryIds = [], tagIds = [], limit = 100 }: UseCoursesParams = {}) => {
  const sortedCategoryIds = [...categoryIds].sort()
  const sortedTagIds = [...tagIds].sort()

  const { data, isLoading, isFetching, error } = useQuery<Course[], Error>({
    queryKey: ['courses', sortedCategoryIds, sortedTagIds, limit],
    queryFn: ({ signal }) =>
      getCourses({ categoryIds: sortedCategoryIds, tagIds: sortedTagIds, limit }, signal),
    placeholderData: keepPreviousData,
  })

  return { courses: data ?? [], loading: isLoading, isFetching, error: error?.message ?? null }
}

export default useCourses
