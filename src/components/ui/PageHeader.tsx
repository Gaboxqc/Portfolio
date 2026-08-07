import { useLocation, useNavigate } from 'react-router'
import { ArrowIcon } from '../../assets/icons/index'

interface PageHeaderProps {
  backLabel: string
  title: string
  description: string
}

function PageHeader({ backLabel, title, description }: PageHeaderProps) {
  const navigate = useNavigate()
  const { key } = useLocation()

  // 'default' means this is the first entry in the app's history stack (e.g. the
  // visitor landed here directly), so there is nothing to go back to.
  const handleBack = () => {
    if (key === 'default') navigate('/')
    else navigate(-1)
  }

  return (
    <section className='flex flex-col gap-8'>
      <button
        type='button'
        onClick={handleBack}
        className='group flex w-fit cursor-pointer items-center gap-2 hover:text-accent'
      >
        <ArrowIcon
          aria-hidden='true'
          className='h-5 w-5 rotate-180 text-muted-foreground group-hover:text-accent'
        />
        <span className='text-muted-foreground group-hover:text-accent'>{backLabel}</span>
      </button>
      <h1 className='text-5xl md:text-6xl'>{title}</h1>
      <p className='max-w-4xl text-lg text-muted-foreground'>{description}</p>
    </section>
  )
}

export default PageHeader
