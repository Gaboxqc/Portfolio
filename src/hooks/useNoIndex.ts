import { useEffect } from 'react'

const ROBOTS_SELECTOR = 'meta[name="robots"]'

/**
 * Marks a route as off-limits to search engines and sets its title.
 *
 * `robots.txt` asks crawlers not to fetch `/admin`, but a disallowed URL can
 * still be indexed if something links to it. A `noindex` tag is the instruction
 * that actually keeps it out of results. The tag is added on mount and removed
 * on unmount so navigating back to a public page does not leave the whole site
 * marked noindex.
 */
function useNoIndex(title: string) {
  useEffect(() => {
    document.title = title

    let meta = document.head.querySelector<HTMLMetaElement>(ROBOTS_SELECTOR)
    const preexisting = meta !== null

    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'robots'
      document.head.appendChild(meta)
    }

    const previous = meta.content
    meta.content = 'noindex, nofollow'

    return () => {
      if (!meta) return
      if (preexisting) {
        meta.content = previous
      } else {
        meta.remove()
      }
    }
  }, [title])
}

export default useNoIndex
