import { motion } from 'framer-motion'
import TextCardSlim from './TextCardSlim'
import { getDifficultyStyle } from '../../utils/difficultyLevelStyles'
import { getProjectTypeStyle } from '../../utils/projectTypeStyles'
import type { Tag } from '../../types'
import { GithubIcon, LinkIcon } from '../../assets/icons'

interface ProjectCardProps {
  title: string
  description: string
  year: number
  difficulty: string
  tags?: Tag[]
  type: string
  image: string
  gitUrl?: string
  projectUrl?: string
}

const ProjectCard = ({
  title,
  description,
  year,
  difficulty,
  tags = [],
  type,
  image,
  gitUrl,
  projectUrl,
}: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.02 }}
      className={
        'max-h-200 overflow-hidden rounded-2xl border border-primary/40 shadow-accent/40 hover:shadow-2xl group'
      }
    >
      <div className={'h-65 w-fit relative'}>
        <div
          className={
            'absolute right-4 top-4 flex gap-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-500'
          }
        >
          {gitUrl && (
            <a
              href={gitUrl}
              target={'_blank'}
              rel={'noopener noreferrer'}
              aria-label={`${title} — source code`}
              className={'bg-card p-2 rounded-xl'}
            >
              <GithubIcon className={'text-foreground'} />
            </a>
          )}

          {projectUrl && (
            <a
              href={projectUrl}
              target={'_blank'}
              rel={'noopener noreferrer'}
              aria-label={`${title} — live site`}
              className={'bg-card p-2 rounded-xl'}
            >
              <LinkIcon className={'text-foreground'} />
            </a>
          )}
        </div>
        <img src={image} alt={title} className={'h-full w-full object-cover'} />
      </div>
      <div className={'flex flex-col gap-4 bg-card p-4'}>
        <div className={'flex items-center gap-2'}>
          <p className={'text-sm text-muted-foreground'}>{year}</p>
          <p className={`${getDifficultyStyle(difficulty)} rounded-xl border p-2 text-xs`}>
            {difficulty}
          </p>
          <p className={`${getProjectTypeStyle(type)} rounded-xl border p-2 text-xs`}>{type}</p>
        </div>
        <h2>{title}</h2>
        <p className={'text-md text-muted-foreground'}>{description}</p>
        <div>
          <ul className={'flex flex-wrap gap-2'}>
            {tags.map((tag) => {
              return (
                <li key={tag.id}>
                  <TextCardSlim Text={tag.name} />
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard
