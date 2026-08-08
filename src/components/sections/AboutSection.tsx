import SkillCard from '../cards/SkillCard'
import Badge from '../ui/Badge'
import useLanguage from '../../hooks/useLanguage'
import { ArtIcon, CodeIcon, LightningIcon, RocketIcon } from '../../assets/icons/index'

function AboutSection() {
  const { translate } = useLanguage()

  return (
    <section
      id={'about'}
      className={'container mx-auto my-30 flex h-full flex-col items-center px-5 py-16 xl:h-screen'}
    >
      <h2
        className={
          'bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-center text-5xl leading-16 text-transparent'
        }
      >
        {translate('about.title')}
      </h2>
      <p className={'mx-4 my-8 text-center leading-7 text-muted-foreground'}>
        {translate('about.description')}
      </p>
      <div className={'grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}>
        <SkillCard
          icon={CodeIcon}
          title={translate('about.clean-code')}
          description={translate('about.clean-code-description')}
        />
        <SkillCard
          icon={ArtIcon}
          title={translate('about.ai-interfaces')}
          description={translate('about.ai-interfaces-description')}
        />
        <SkillCard
          icon={RocketIcon}
          title={translate('about.high-performance')}
          description={translate('about.high-performance-description')}
        />
        <SkillCard
          icon={LightningIcon}
          title={translate('about.fast-delivery')}
          description={translate('about.fast-delivery-description')}
        />
      </div>
      <h2 className={'my-10 text-2xl'}>{translate('about.second-title')}</h2>
      <div className='grid w-full grid-cols-2 gap-3 gap-y-6 md:grid-cols-3 lg:grid-cols-4'>
        <Badge variant='tile' text={'HTML'} />
        <Badge variant='tile' text={'CSS'} />
        <Badge variant='tile' text={'JavaScript'} />
        <Badge variant='tile' text={'Python'} />
        <Badge variant='tile' text={'React'} />
        <Badge variant='tile' text={'FastAPI'} />
        <Badge variant='tile' text={'PostgreSQL'} />
        <Badge variant='tile' text={'Figma'} />
      </div>
    </section>
  )
}

export default AboutSection
