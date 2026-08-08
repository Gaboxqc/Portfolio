import { PlatziIcon, LinkIcon, DateIcon } from '../../assets/icons/index'
import Badge from '../ui/Badge'
import type { Tag } from '../../types'

interface CourseCardProps {
  title: string
  academy: string
  year: number
  tags?: Tag[]
  url: string
}

const CourseCard = ({ title, academy, year, tags = [], url }: CourseCardProps) => {
  return (
    <div className='group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-primary/20 bg-card p-5'>
      <div className='pointer-events-none absolute top-0 right-0 z-0 h-12 w-12 translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-primary/10 transition-transform duration-500 ease-out group-hover:scale-[25]' />

      <div className='relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 outline-1'>
        <PlatziIcon className='h-8 w-8' />
      </div>

      <div className='flex flex-col gap-4'>
        <h3 className='font-normal'>{title}</h3>
        <p className='text-muted-foreground'>{academy}</p>
        <div className='flex items-center gap-2'>
          <DateIcon className='h-5 w-5 text-muted-foreground' />
          <p className='text-sm text-muted-foreground'>{year}</p>
        </div>
        <div className='flex items-center justify-between'>
          <ul className='my-2 flex max-w-xs flex-wrap gap-2'>
            {tags.map((t) => (
              <li key={t.name}>
                <Badge text={t.name} />
              </li>
            ))}
          </ul>
          <a
            className='self-start'
            href={url}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={title}
          >
            <LinkIcon className='text-muted-foreground' />
          </a>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
