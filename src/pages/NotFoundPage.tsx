import { Link } from 'react-router'
import useLanguage from '../hooks/useLanguage'

const NotFoundPage = () => {
  const { translate } = useLanguage()

  return (
    <div className='container mx-auto flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 pt-24 text-center'>
      <p className='text-7xl font-bold text-accent'>404</p>
      <h1 className='text-3xl'>{translate('not-found.title')}</h1>
      <p className='max-w-md text-muted-foreground'>{translate('not-found.description')}</p>
      <Link
        to='/'
        className='rounded-lg bg-linear-to-r from-primary to-accent px-6 py-3 text-white shadow-accent/60 hover:shadow-lg'
      >
        {translate('not-found.back')}
      </Link>
    </div>
  )
}

export default NotFoundPage
