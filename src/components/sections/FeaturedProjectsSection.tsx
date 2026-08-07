import { useEffect, useRef, useState } from 'react'
import useLanguage from '../../hooks/useLanguage'
import FeaturedProjectCard from '../cards/FeaturedProjectCard'
import useProjects from '../../hooks/useProjects'
import getTranslation from '../../utils/getTranslation'

export default function FeaturedProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRefs = useRef<(Element | null)[]>([])
  const { translate, locale } = useLanguage()
  const { projects, loading, error } = useProjects({ isMain: true })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((e) => e.isIntersecting)
        if (visibleSection) {
          const index = sectionRefs.current.indexOf(visibleSection.target)
          if (index !== -1) setActiveIndex(index)
        }
      },
      {
        rootMargin: '-49% 0px -49% 0px',
        threshold: 0,
      },
    )

    sectionRefs.current.forEach((ref) => ref && observer.observe(ref))
    return () => observer.disconnect()
  }, [projects])

  const stepPct = projects.length > 0 ? 100 / projects.length : 0

  return (
    <div className='container mx-auto flex flex-col items-center px-4 '>
      <h2 className='bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-center text-5xl font-bold text-transparent'>
        {translate('projects.title')}
      </h2>
      <p className='my-4 text-center leading-7 text-muted-foreground'>
        {translate('projects.subtitle')}
      </p>

      {loading && (
        <div className='flex w-full flex-col gap-8 py-16'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='h-40 w-full animate-pulse rounded-xl bg-muted-foreground/10' />
          ))}
        </div>
      )}

      {error && <p className='p-10 text-center text-red-500'>Error: {error}</p>}

      {!loading && !error && (
        <div className='grid w-full max-w-none gap-8 lg:grid-cols-[auto_1fr_2fr] lg:gap-16'>
          <div className='hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-8 lg:items-center lg:justify-center'>
            <div className='relative h-48 w-1 rounded-full bg-zinc-600'>
              <div
                className='absolute left-0 w-full rounded-full bg-accent shadow-[0_0_15px_rgba(139,92,246,0.8)] transition-all duration-500 ease-in-out'
                style={{ height: `${stepPct}%`, top: `${activeIndex * stepPct}%` }}
              />
            </div>
          </div>

          <div className='flex flex-col py-16 md:py-[25vh]'>
            {projects.map((project, index) => {
              const translation = getTranslation(project.translations, locale)
              return (
                <FeaturedProjectCard
                  key={project.id}
                  ref={(el) => {
                    sectionRefs.current[index] = el
                  }}
                  position={index + 1}
                  year={project.year}
                  title={translation.title}
                  description={translation.description}
                  tags={project.tags}
                  isActive={activeIndex === index}
                />
              )
            })}
          </div>

          <div className='hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:justify-center'>
            <div className='aspect-video w-full overflow-hidden rounded-2xl'>
              {projects[activeIndex] && (
                <img
                  src={projects[activeIndex].image_url}
                  alt={getTranslation(projects[activeIndex].translations, locale).title}
                  className='h-full w-full object-cover object-center transition-all duration-500'
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
