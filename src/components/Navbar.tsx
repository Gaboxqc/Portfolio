import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import NavbarSections from './sections/NavbarSections'
import LanguageSelector from './ui/LanguageSelector'
import useLanguage from '../hooks/useLanguage'
import { LogoIcon } from '../assets/icons/index'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { translate } = useLanguage()

  useEffect(() => {
    let frame = 0

    // Coalesce scroll events into one state update per frame; the raw event
    // fires far more often than the pill/inline state can meaningfully change.
    const handleScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        setIsScrolled(window.scrollY > 50)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <nav
      aria-label={translate('navbar.portfolio')}
      // inset-x-0 rather than w-screen: w-screen ignores the scrollbar width and
      // pushes the page into horizontal overflow.
      className={`${isScrolled ? 'grid-cols-1' : 'bg-background/40 grid-cols-2 md:grid-cols-3'} fixed inset-x-0 z-20 grid min-h-20 items-center px-2 transition-all duration-500 ease-in-out md:px-10`}
    >
      <div className={`${isScrolled ? ' hidden ' : 'flex'} items-center`}>
        <LogoIcon className={'h-11 w-11'} />
        <Link to={'/'}>
          <p className={'font-bold'}>{translate('navbar.portfolio')}</p>
        </Link>
      </div>

      <div className={`items-center justify-center md:flex ${isScrolled ? 'flex' : 'hidden'}`}>
        {isScrolled ? (
          <motion.div
            key='pill'
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            <NavbarSections pill={true} />
          </motion.div>
        ) : (
          <motion.div
            key='inline'
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            <NavbarSections pill={false} />
          </motion.div>
        )}
      </div>

      <div className={`${isScrolled ? 'hidden' : 'flex'} items-center gap-4 justify-self-end`}>
        <LanguageSelector />
        <a
          href={'https://assets.gabrielmayorga.dev/portfolio/curriculum.pdf'}
          download={'Gabriel-Mayorga-CV'}
          target={'_blank'}
          rel={'noopener noreferrer'}
          className={
            'flex h-10 w-auto cursor-pointer items-center justify-center rounded-lg bg-primary/10 px-4 outline-1 hover:bg-primary/20'
          }
        >
          CV
        </a>
      </div>
    </nav>
  )
}

export default Navbar
