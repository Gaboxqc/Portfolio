import { motion } from 'framer-motion'
import { LinkIcon, DateIcon, FilledStarIcon } from '../../assets/icons/index'
import AcademyLogo from '../ui/AcademyLogo'
import Badge from '../ui/Badge'
import type { Tag } from '../../types'

interface CertificationCardProps {
  title: string
  academy: string
  academyImage?: string | null
  year: number
  tags?: Tag[]
  url: string | null
  isMain?: boolean
}

const CertificationCard = ({
  title,
  academy,
  academyImage,
  year,
  tags = [],
  url,
  isMain = false,
}: CertificationCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={`flex flex-col gap-4 rounded-xl border bg-card p-5 transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10 ${
        isMain
          ? 'border-accent/50 hover:border-accent/80'
          : 'border-primary/20 hover:border-primary/50'
      }`}
    >
      <div className='flex h-16 justify-between'>
        {/* The hover flourish stays on a wrapper so AcademyLogo owns only the
            logo itself and both cards render it identically. */}
        <motion.div whileHover={{ scale: 1.15, rotate: 5 }} transition={{ duration: 0.2 }}>
          <AcademyLogo name={academy} imageUrl={academyImage} />
        </motion.div>
        {isMain && <FilledStarIcon className='text-accent' />}
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
          {/* No certificate URL means no link, rather than a dead anchor. */}
          {url && (
            <a
              className='self-start'
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={title}
            >
              <LinkIcon className='text-muted-foreground' />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default CertificationCard
