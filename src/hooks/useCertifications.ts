import { useQuery } from '@tanstack/react-query'
import { getCertifications } from '../services/certifications'
import type { Certification } from '../types'

interface UseCertificationsParams {
  isMain?: boolean
  offset?: number
  limit?: number
}

const useCertifications = ({ isMain, offset = 0, limit = 100 }: UseCertificationsParams = {}) => {
  const { data, isLoading, error } = useQuery<Certification[], Error>({
    queryKey: ['certifications', isMain, offset, limit],
    queryFn: ({ signal }) => getCertifications({ isMain, offset, limit }, signal),
    retry: 2,
  })

  return { certifications: data ?? [], loading: isLoading, error: error?.message ?? null }
}

export default useCertifications
