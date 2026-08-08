import { ArrowIcon } from '../../assets/icons/index'
import { Link } from 'react-router'
import CertificationsContainer from '../containers/CertificationsContainer'
import useLanguage from '../../hooks/useLanguage'
import useCertifications from '../../hooks/useCertifications'

function CertificationsSection() {
  const { translate } = useLanguage()
  const { certifications, loading, error } = useCertifications({ limit: 4 })
  return (
    <section
      id={'certifications'}
      className={'bg-linear-to-b from-primary/5 via-transparent to-accent/5 py-30'}
    >
      <div className='container mx-auto flex flex-col items-center py-16'>
        <h2
          className={
            'bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-center text-5xl leading-16 text-transparent md:mx-4 md:text-left'
          }
        >
          {translate('certifications.title')}
        </h2>
        <div className='relative flex w-full items-center justify-center md:mx-4'>
          <p className='mx-4 my-4 text-center leading-7 text-muted-foreground'>
            {translate('certifications.subtitle')}
          </p>
          <Link
            to='/courses'
            className='absolute right-0 hidden items-center gap-1 font-normal text-primary hover:text-accent md:flex'
          >
            {translate('certifications.all-courses')}
            <ArrowIcon />
          </Link>
        </div>
        <div className={'my-20 grid w-full grid-cols-1 gap-12 px-4 md:grid-cols-2'}>
          <CertificationsContainer
            certifications={certifications}
            loading={loading}
            error={error}
          />
        </div>
        <Link
          to={'/courses'}
          className={
            'flex items-center gap-2 self-center rounded-xl bg-primary/20 p-4 outline-1 hover:bg-primary/30 md:hidden'
          }
        >
          {translate('certifications.all-courses')}
          <ArrowIcon />
        </Link>
      </div>
    </section>
  )
}

export default CertificationsSection
