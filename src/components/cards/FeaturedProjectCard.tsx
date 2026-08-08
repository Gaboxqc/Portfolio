import { forwardRef } from 'react'
import Badge from '../ui/Badge'
import type { Tag } from '../../types'

interface FeaturedProjectCardProps {
  position: number
  year: number
  title: string
  description: string
  tags: Tag[]
  isActive: boolean
}

const FeaturedProjectCard = forwardRef<HTMLDivElement, FeaturedProjectCardProps>(
  ({ position, year, title, description, tags, isActive }, ref) => {
    return (
      <div
        ref={ref}
        className={`grid grid-cols-12 px-2 min-h-[40vh] lg:min-h-[45vh] py-8 content-center transition-all duration-500 ${
          isActive ? 'opacity-100 scale-100' : 'opacity-25 scale-98'
        }`}
      >
        <span
          className={`col-span-3 text-6xl font-bold transition-colors duration-500 ${
            isActive ? 'text-accent' : 'text-muted-foreground'
          }`}
        >
          0{position}
        </span>

        <div className='col-span-9 flex flex-col gap-4'>
          <span className='text-sm text-muted-foreground'>{year}</span>
          <h3
            className={`text-3xl font-bold tracking-tight transition-colors duration-500 ${
              isActive ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            {title}
          </h3>
          <p className='text-md leading-relaxed text-muted-foreground'>{description}</p>
          <div className='flex flex-wrap gap-2'>
            {tags.map((t) => (
              <Badge key={t.id} text={t.name} />
            ))}
          </div>
        </div>
      </div>
    )
  },
)

FeaturedProjectCard.displayName = 'FeaturedProjectCard'
export default FeaturedProjectCard
