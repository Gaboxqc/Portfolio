import { motion } from 'framer-motion'

/**
 * tag    — static label for technology chips inside cards.
 * filter — selectable chip, styled from `isActive`.
 * tile   — larger grid cell that animates into view.
 */
type BadgeVariant = 'tag' | 'filter' | 'tile'

interface BadgeProps {
  text: string
  variant?: BadgeVariant
  isActive?: boolean
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  tag: 'w-fit rounded-xl bg-primary/10 p-2 text-center text-sm text-muted-foreground outline-1',
  filter: 'h-fit w-fit cursor-pointer rounded-xl border p-2 text-sm hover:border-primary/40',
  tile: 'rounded-2xl border border-primary/30 bg-card p-3 text-center hover:border-primary/80',
}

const FILTER_STATE_STYLES = {
  active: 'border-accent/20 bg-primary/20 text-foreground',
  inactive: 'border-primary/20 bg-transparent text-muted-foreground',
}

const Badge = ({ text, variant = 'tag', isActive = false }: BadgeProps) => {
  const className = [
    VARIANT_STYLES[variant],
    variant === 'filter' && (isActive ? FILTER_STATE_STYLES.active : FILTER_STATE_STYLES.inactive),
  ]
    .filter(Boolean)
    .join(' ')

  if (variant === 'filter') {
    return (
      <motion.div
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        className={className}
      >
        <p>{text}</p>
      </motion.div>
    )
  }

  if (variant === 'tile') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' }}
        viewport={{ once: true }}
        className={className}
      >
        <p>{text}</p>
      </motion.div>
    )
  }

  return (
    <div className={className}>
      <span>{text}</span>
    </div>
  )
}

export default Badge
