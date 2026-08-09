import type { AxiosResponse } from 'axios'

import { adminApi } from '../adminApi'
import type { Page } from '../../types'

/**
 * Generic CRUD against the portfolio API.
 *
 * The API gives every resource an identical contract, so one thin layer beats
 * five near-identical modules. Resources with genuinely different shapes get
 * their payload types below rather than their own request functions.
 */

const readPage = <T>(response: AxiosResponse<T[]>): Page<T> => ({
  items: response.data,
  // Phase B added X-Total-Count; fall back to the page length so a proxy that
  // strips the header degrades to a single-page view rather than an empty one.
  total: Number(response.headers['x-total-count'] ?? response.data.length),
})

export interface ListParams {
  offset?: number
  limit?: number
}

export const listResource = <T>(path: string, { offset = 0, limit = 20 }: ListParams = {}) =>
  adminApi.get<T[]>(path, { params: { offset, limit } }).then(readPage<T>)

export const getResource = <T>(path: string, id: number | string) =>
  adminApi.get<T>(`${path}/${id}`).then((response) => response.data)

export const createResource = <T, P>(path: string, payload: P) =>
  adminApi.post<T>(path, payload).then((response) => response.data)

export const updateResource = <T, P>(path: string, id: number | string, payload: P) =>
  adminApi.patch<T>(`${path}/${id}`, payload).then((response) => response.data)

export const deleteResource = (path: string, id: number | string) =>
  adminApi.delete(`${path}/${id}`).then(() => undefined)

// ── Write payloads ───────────────────────────────────────────────────────────
// Only what the API accepts. Nested objects such as `project_type` are
// read-only projections; writes address them by id.

export interface ProjectWrite {
  year: number
  is_main: boolean
  project_type_id: number
  difficulty_level_id: number
  image_url: string | null
  git_url: string | null
  deploy_url: string | null
  tag_ids: number[]
}

export interface CredentialWrite {
  year: number
  is_main: boolean
  url: string | null
  academy_id: number
  category_id: number
  tag_ids: number[]
  /** Certifications only; the courses endpoint ignores it. */
  validation_serial?: string | null
}

export const ADMIN_PATHS = {
  projects: '/portfolio/projects',
  courses: '/portfolio/courses',
  certifications: '/portfolio/certifications',
  tags: '/portfolio/tags',
  academies: '/portfolio/academies',
  categories: '/portfolio/categories',
  projectTypes: '/portfolio/project-types',
  difficultyLevels: '/portfolio/difficulty-levels',
  languages: '/portfolio/languages',
} as const
