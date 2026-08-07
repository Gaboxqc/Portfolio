import CertificationCard from '../cards/CertificationCard'
import useLanguage from '../../hooks/useLanguage'
import useCertifications from '../../hooks/useCertifications'
import getTranslation from '../../utils/getTranslation'
import { motion } from 'framer-motion'

interface CertificationsContainerProps {
  limit?: number
  isMain?: boolean
  animation?: string
}

function CertificationsContainer({ limit = 10, isMain, animation }: CertificationsContainerProps) {
  const { locale } = useLanguage()
  const { certifications, loading, error } = useCertifications({ isMain, limit })

  if (loading)
    return (
      <>
        {[...Array(4)].map((_, i) => (
          <div key={i} className='h-40 w-full animate-pulse rounded-xl bg-muted-foreground/10' />
        ))}
      </>
    )

  if (error) return <p className='p-10 text-center text-red-500'>Error: {error}</p>

  if (!certifications.length)
    return (
      <p className='col-span-full p-10 text-center text-muted-foreground'>
        No se encontraron certificaciones.
      </p>
    )

  return (
    <>
      {certifications.map((certification) => {
        const translation = getTranslation(certification.translations, locale)
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' }}
            viewport={{ once: true }}
            key={certification.id}
          >
            <CertificationCard
              title={translation.title}
              year={certification.year}
              academy={certification.academy.name}
              url={certification.url}
              tags={certification.tags}
              isMain={isMain}
              animation={animation}
            />
          </motion.div>
        )
      })}
    </>
  )
}

export default CertificationsContainer
