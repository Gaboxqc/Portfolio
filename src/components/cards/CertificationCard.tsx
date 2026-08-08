import { motion } from 'framer-motion'
import { PlatziIcon, LinkIcon, DateIcon, FilledStarIcon } from '../../assets/icons/index'
import TextCardSlim from './TextCardSlim'
import type { Tag } from '../../types'

interface CertificationCardProps {
  title: string
  academy: string
  year: number
  tags?: Tag[]
  serial?: string
  url: string
  isMain?: boolean
  animation?: string
}

const CertificationCard = ({
  title,
  academy,
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
        <motion.div
          whileHover={{ scale: 1.15, rotate: 5 }}
          transition={{ duration: 0.2 }}
          className='flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 outline-1'
        >
          <PlatziIcon className='h-8 w-8' />
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
                <TextCardSlim Text={t.name} />
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
    </motion.div>
  )
}

export default CertificationCard
