import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createResource,
  deleteResource,
  getResource,
  listResource,
  updateResource,
} from '../../services/admin/resources'
import type { Page } from '../../types'

/**
 * Query keys are namespaced under 'admin' so invalidating after a write never
 * touches the public site's cached reads, which have different staleness rules.
 */
export const adminKeys = {
  list: (path: string, offset: number, limit: number) => ['admin', path, 'list', offset, limit],
  detail: (path: string, id: number | string) => ['admin', path, 'detail', id],
  all: (path: string) => ['admin', path],
}

export const useAdminList = <T>(path: string, offset: number, limit: number) => {
  const query = useQuery<Page<T>, Error>({
    queryKey: adminKeys.list(path, offset, limit),
    queryFn: () => listResource<T>(path, { offset, limit }),
    // Keeps the current page on screen while the next one loads, instead of
    // collapsing the table to a skeleton on every page change.
    placeholderData: keepPreviousData,
    // Admin data is edited in this very tab, so a stale view is misleading.
    staleTime: 0,
  })

  return {
    items: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    loading: query.isLoading,
    fetching: query.isFetching,
    error: query.error?.message ?? null,
  }
}

export const useAdminDetail = <T>(path: string, id: number | string | undefined) => {
  const query = useQuery<T, Error>({
    queryKey: adminKeys.detail(path, id ?? 'new'),
    queryFn: () => getResource<T>(path, id as number | string),
    // 'new' has nothing to fetch.
    enabled: id !== undefined,
    staleTime: 0,
  })

  return { data: query.data, loading: query.isLoading, error: query.error?.message ?? null }
}

/**
 * Create, update and delete for one resource path.
 *
 * Every mutation invalidates the whole `['admin', path]` subtree rather than
 * patching the cache by hand: a write can change pagination totals and ordering,
 * so a surgical update would be wrong more often than it is fast.
 */
export const useAdminMutations = <T, P>(path: string) => {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: adminKeys.all(path) })

  const create = useMutation<T, Error, P>({
    mutationFn: (payload) => createResource<T, P>(path, payload),
    onSuccess: invalidate,
  })

  const update = useMutation<T, Error, { id: number | string; payload: P }>({
    mutationFn: ({ id, payload }) => updateResource<T, P>(path, id, payload),
    onSuccess: invalidate,
  })

  const remove = useMutation<void, Error, number | string>({
    mutationFn: (id) => deleteResource(path, id),
    onSuccess: invalidate,
  })

  return { create, update, remove }
}
