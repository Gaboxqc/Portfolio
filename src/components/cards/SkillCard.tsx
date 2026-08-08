import { motion } from 'framer-motion'

import useTilt from '../../hooks/useTilt'
import type { IconComponent } from '../../types'

interface SkillCardProps {
  icon: IconComponent
  title: string
  description: string
}

const SkillCard = ({ icon: Icon, title, description }: SkillCardProps) => {
  const { rotateX, rotateY, handleMouseMove, handleMouseLeave, fadeInLeft } = useTilt()

  return (
    <motion.div
      {...fadeInLeft}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      whileHover={{ scale: 1.03 }}
      className='my-4 flex max-w-100 flex-col gap-y-4 rounded-xl border border-primary/30 bg-card p-4 transition-colors duration-300 hover:border-primary'
    >
      <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/25 text-primary'>
        <Icon />
      </div>
      <h2>{title}</h2>
      <p className='text-muted-foreground'>{description}</p>
    </motion.div>
  )
}

export default SkillCard
