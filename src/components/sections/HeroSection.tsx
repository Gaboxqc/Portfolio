import useLanguage from '../../hooks/useLanguage'
import TypewriterLoop from '../ui/TypewriterLoop'
import GradientButton from '../ui/GradientButton'
import { Link } from 'react-router'
import { GithubIcon, LinkedInIcon, MailIcon } from '../../assets/icons/index'

function HeroSection() {
  const { translate } = useLanguage()
  return (
    <section
      className={'h-screen bg-linear-to-br from-primary/20 via-transparent to-accent/20 text-white'}
    >
      <div
        className={
          'container mx-auto flex h-full flex-col items-start justify-center gap-y-10 px-4 pt-4 md:gap-4 md:gap-y-12'
        }
      >
        <div
          className={
            'mt-12 hidden items-center gap-2 rounded-3xl bg-muted-foreground/10 p-2 px-3 outline-1 md:flex'
          }
        >
          <div className={'size-2 animate-pulse rounded-full bg-accent'}></div>
          <p className={'text-sm'}>{translate('hero.available')}</p>
        </div>
        <div className={'flex flex-col'}>
          <h1 className={'pb-3 text-7xl text-foreground md:text-8xl'}>Gabriel Mayorga</h1>
          <TypewriterLoop />
        </div>
        <p className={'max-w-150 text-lg text-muted-foreground'}>
          {translate('hero.description')}.
        </p>
        <div className={'flex gap-4'}>
          <GradientButton label={translate('hero.projects')} nav={'/projects'} />

          <Link
            to={'#contact'}
            className={
              'flex h-13 w-auto items-center justify-center rounded-lg px-4 border border-accent/20 hover:bg-primary/10'
            }
          >
            {translate('hero.contact')}
          </Link>
        </div>
        <div className={'flex items-center justify-center gap-5 text-muted-foreground'}>
          <a
            href={'https://github.com/Gaboxqc'}
            target={'_blank'}
            rel={'noopener noreferrer'}
            aria-label={'GitHub'}
          >
            <GithubIcon className={'h-8 w-8'} />
          </a>
          <a
            href={'https://linkedin.com/in/gabriel-mayorga-b36611231'}
            target={'_blank'}
            rel={'noopener noreferrer'}
            aria-label={'LinkedIn'}
          >
            <LinkedInIcon className={'h-8 w-8'} />
          </a>
          <a href={'mailto:gabrielmayorgate@gmail.com'} aria-label={'Email'}>
            <MailIcon className={'h-8 w-8'} />
          </a>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
