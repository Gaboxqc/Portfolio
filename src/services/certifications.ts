import { api } from './api'
import type { Certification } from '../types'

interface GetCertificationsParams {
  isMain?: boolean
  offset?: number
  limit?: number
}

export const getCertifications = (
  { isMain, offset = 0, limit = 10 }: GetCertificationsParams = {},
  signal?: AbortSignal,
): Promise<Certification[]> => {
  const params = new URLSearchParams({ offset: String(offset), limit: String(limit) })
  if (isMain !== undefined) params.append('is_main', String(isMain))

  return api.get<Certification[]>(`/certifications?${params}`, { signal }).then((res) => res.data)
}
