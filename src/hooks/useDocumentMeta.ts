import { useEffect } from 'react'

const SITE_NAME = 'Gabriel Mayorga'
const SITE_URL = 'https://gabrielmayorga.dev'

interface DocumentMeta {
  /** Page title, without the site name suffix. */
  title: string
  description: string
  /** Path this page should be indexed under, e.g. '/projects'. */
  path: string
}

const setAttribute = (selector: string, attribute: string, value: string) => {
  document.head.querySelector(selector)?.setAttribute(attribute, value)
}

/**
 * Keeps the document title, description, canonical URL and social tags in sync
 * with the active route. The tags themselves live in index.html so crawlers and
 * link unfurlers that do not run JavaScript still get sensible defaults.
 */
function useDocumentMeta({ title, description, path }: DocumentMeta) {
  useEffect(() => {
    const fullTitle = `${title} — ${SITE_NAME}`
    const url = `${SITE_URL}${path}`

    document.title = fullTitle

    setAttribute('meta[name="description"]', 'content', description)
    setAttribute('link[rel="canonical"]', 'href', url)

    setAttribute('meta[property="og:title"]', 'content', fullTitle)
    setAttribute('meta[property="og:description"]', 'content', description)
    setAttribute('meta[property="og:url"]', 'content', url)

    setAttribute('meta[name="twitter:title"]', 'content', fullTitle)
    setAttribute('meta[name="twitter:description"]', 'content', description)
  }, [title, description, path])
}

export default useDocumentMeta
