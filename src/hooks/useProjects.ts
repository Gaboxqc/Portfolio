import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { getProjects } from '../services/projects'
import useDebounce from './useDebounce'
import type { Project } from '../types'

interface UseProjectsParams {
  typeIds?: number[]
  difficultyIds?: number[]
  tagIds?: number[]
  search?: string
  isMain?: boolean
  limit?: number
}

const useProjects = ({
  typeIds = [],
  difficultyIds = [],
  tagIds = [],
  search = '',
  isMain,
  limit = 100,
}: UseProjectsParams = {}) => {
  const debouncedSearch = useDebounce(search)
  const sortedTypeIds = [...typeIds].sort()
  const sortedDifficultyIds = [...difficultyIds].sort()
  const sortedTagIds = [...tagIds].sort()

  const { data, isLoading, error } = useQuery<Project[], Error>({
    queryKey: [
      'projects',
      sortedTypeIds,
      sortedDifficultyIds,
      sortedTagIds,
      debouncedSearch,
      limit,
    ],
    queryFn: ({ signal }) =>
      getProjects(
        {
          typeIds: sortedTypeIds,
          difficultyIds: sortedDifficultyIds,
          tagIds: sortedTagIds,
          search: debouncedSearch,
          limit,
          isMain,
        },
        signal,
      ),
    placeholderData: keepPreviousData,
  })

  return { projects: data ?? [], loading: isLoading, error: error?.message ?? null }
}

export default useProjects
