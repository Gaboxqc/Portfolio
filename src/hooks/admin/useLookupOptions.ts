import { useQuery } from '@tanstack/react-query'

import { listResource } from '../../services/admin/resources'
import type { FilterOption, Language } from '../../types'

// The API caps `limit` at 100, which comfortably covers every lookup table.
const ALL = { offset: 0, limit: 100 }

/**
 * Loads a lookup table in full, for use in a dropdown or tag picker.
 *
 * Lookups change rarely, so these stay fresh for a few minutes even though the
 * resource lists themselves are always refetched.
 */
export const useLookupOptions = (path: string) => {
  const query = useQuery({
    queryKey: ['admin', path, 'options'],
    queryFn: () => listResource<FilterOption>(path, ALL),
    staleTime: 5 * 60 * 1000,
  })

  return { options: query.data?.items ?? [], loading: query.isLoading }
}

export const useLanguages = () => {
  const query = useQuery({
    queryKey: ['admin', 'languages', 'options'],
    queryFn: () => listResource<Language>('/portfolio/languages', ALL),
    staleTime: 5 * 60 * 1000,
  })

  return { languages: query.data?.items ?? [], loading: query.isLoading }
}
