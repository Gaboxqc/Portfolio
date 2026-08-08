import HeroSection from '../components/sections/HeroSection'
import AboutSection from '../components/sections/AboutSection'
import CertificationsSection from '../components/sections/CertificationsSection'
import ContactSection from '../components/sections/ContactSection'
import FeaturedProjectsSection from '../components/sections/FeaturedProjectsSection'
import useLanguage from '../hooks/useLanguage'
import useDocumentMeta from '../hooks/useDocumentMeta'

const HomePage = () => {
  const { translate } = useLanguage()

  useDocumentMeta({
    title: translate('hero.subtitle'),
    description: translate('hero.description'),
    path: '/',
  })

  return (
    <div className={'flex w-full flex-col'}>
      <HeroSection />
      <AboutSection />
      <FeaturedProjectsSection />
      <CertificationsSection />
      <ContactSection />
    </div>
  )
}

export default HomePage
