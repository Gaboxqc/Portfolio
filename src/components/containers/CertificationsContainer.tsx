import CertificationCard from '../cards/CertificationCard'
import AsyncCollection from '../ui/AsyncCollection'
import useLanguage from '../../hooks/useLanguage'
import getTranslation from '../../utils/getTranslation'
import type { Certification } from '../../types'

interface CertificationsContainerProps {
  certifications?: Certification[]
  loading?: boolean
  error?: string | null
  /** Highlights the cards as featured; the query itself is owned by the page. */
  isMain?: boolean
}

function CertificationsContainer({
  certifications = [],
  loading = false,
  error = null,
  isMain = false,
}: CertificationsContainerProps) {
  const { locale } = useLanguage()

  return (
    <AsyncCollection
      items={certifications}
      loading={loading}
      error={error}
      emptyKey='state.no-certifications'
    >
      {(certification) => {
        const translation = getTranslation(certification.translations, locale)
        return (
          <CertificationCard
            title={translation.title}
            year={certification.year}
            academy={certification.academy.name}
            url={certification.url}
            tags={certification.tags}
            isMain={isMain}
          />
        )
      }}
    </AsyncCollection>
  )
}

export default CertificationsContainer
