import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import useLanguage from '../../hooks/useLanguage'

interface AsyncCollectionProps<T> {
  items: T[]
  loading?: boolean
  error?: string | null
  /** Locale key for the "nothing found" message, e.g. 'state.no-projects'. */
  emptyKey: string
  skeletonCount?: number
  children: (item: T) => ReactNode
}

/**
 * Renders the loading / error / empty / loaded states shared by every
 * collection on the site, so the containers only describe how one item maps to
 * a card. Each item is wrapped in the standard scroll-into-view animation.
 */
function AsyncCollection<T extends { id: number }>({
  items,
  loading = false,
  error = null,
  emptyKey,
  skeletonCount = 4,
  children,
}: AsyncCollectionProps<T>) {
  const { translate } = useLanguage()

  if (loading)
    return (
      <>
        {Array.from({ length: skeletonCount }, (_, i) => (
          <div key={i} className='h-40 w-full animate-pulse rounded-xl bg-muted-foreground/10' />
        ))}
      </>
    )

  if (error)
    return (
      <p role='alert' className='col-span-full p-10 text-center text-red-500'>
        {translate('state.error')}
      </p>
    )

  if (!items.length)
    return (
      <p className='col-span-full p-10 text-center text-muted-foreground'>{translate(emptyKey)}</p>
    )

  return (
    <>
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' }}
          viewport={{ once: true }}
        >
          {children(item)}
        </motion.div>
      ))}
    </>
  )
}

export default AsyncCollection
