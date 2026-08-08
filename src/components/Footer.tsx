import {
  LogoIcon,
  GithubIcon,
  LinkedInIcon,
  MailIcon,
  LocationIcon,
  TimeIcon,
} from '../assets/icons/index'
import UseLanguage from '../hooks/useLanguage'
import { Link } from 'react-router'

const Footer = () => {
  const { translate } = UseLanguage()

  return (
    <footer className={'container mx-auto mt-16 p-4 md:mt-32'}>
      <div
        className={'flex flex-col justify-center md:flex-row md:items-center md:justify-between'}
      >
        <div className={'mt-4 mb-16 flex max-w-100 flex-col items-start gap-8'}>
          <div className={'flex gap-4'}>
            <LogoIcon className={'h-8 w-8'} />
            <h2>Gabriel Mayorga</h2>
          </div>
          <p className={'text-md text-muted-foreground'}>{translate('footer.title')}</p>
          <div className={'flex items-center justify-center gap-4'}>
            <a
              href={'https://github.com/Gaboxqc'}
              target={'_blank'}
              rel={'noopener noreferrer'}
              aria-label={'GitHub'}
              className={'cursor-pointer rounded-xl bg-primary/10 p-2 outline-1'}
            >
              <GithubIcon className={'h-8 w-8'} />
            </a>
            <a
              href={'https://linkedin.com/in/gabriel-mayorga-b36611231'}
              target={'_blank'}
              rel={'noopener noreferrer'}
              aria-label={'LinkedIn'}
              className={'cursor-pointer rounded-xl bg-primary/10 p-2 outline-1'}
            >
              <LinkedInIcon className={'h-8 w-8'} />
            </a>
            <a
              href={'mailto:gabrielmayorgate@gmail.com'}
              aria-label={'Email'}
              className={'cursor-pointer rounded-xl bg-primary/10 p-2 outline-1'}
            >
              <MailIcon className={'h-8 w-8'} />
            </a>
          </div>
        </div>
        <div className={'mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'}>
          <div>
            <h4 className={'text-lg'}>{translate('footer.navigation')}</h4>
            <ul className={'my-4 flex flex-col gap-4 text-muted-foreground'}>
              <li>
                <Link to={'/#about'}>{translate('footer.about')}</Link>
              </li>
              <li>
                <Link to={'/projects'}>{translate('footer.projects')}</Link>
              </li>
              <li>
                <Link to={'/courses'}>{translate('footer.courses')}</Link>
              </li>
              <li>
                <Link to={'/#contact'}>{translate('footer.contact')}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className={'text-lg'}>{translate('footer.services')}</h4>
            <ul className={'my-4 flex flex-col gap-4 text-muted-foreground'}>
              <li>{translate('footer.web-development')}</li>
              <li>{translate('footer.app-development')}</li>
              <li>{translate('footer.desktop-development')}</li>
              <li>{translate('footer.mentoring')}</li>
            </ul>
          </div>
          <div>
            <h4 className={'text-lg'}>{translate('footer.contact')}</h4>
            <ul className={'my-4 flex flex-col gap-4 text-muted-foreground'}>
              <li className={'flex cursor-default items-center gap-2'}>
                <MailIcon className={'h-8 w-8'} />
                <p>gabrielmayorgate@gmail.com</p>
              </li>
              <li className={'flex cursor-default items-center gap-2'}>
                <LocationIcon className={'h-8 w-8'} />
                <p>Managua, NI</p>
              </li>
              <li className={'flex cursor-default items-center gap-2'}>
                <TimeIcon className={'h-8 w-8'} />
                <p>{translate('footer.time')}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={'border-t py-12 text-center text-sm text-muted-foreground'}>
        <p>
          © {new Date().getFullYear()} Gabriel Mayorga. {translate('footer.rights')}
        </p>
        <div className={'mt-4 flex justify-center gap-4'}>
          <p>{translate('footer.privacy')}</p>
          <p>{translate('footer.service')}</p>
          <p>Cookies</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
