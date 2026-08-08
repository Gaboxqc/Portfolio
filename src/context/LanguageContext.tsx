import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import es from '../locales/es.json'
import en from '../locales/en.json'
import de from '../locales/de.json'

export type Locale = 'es' | 'en' | 'de'

type Dictionary = Record<string, unknown>

export interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  translate: (path: string) => string
}

// eslint-disable-next-line react-refresh/only-export-components
export const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

const dictionaries: Record<Locale, Dictionary> = { es, en, de }

const DEFAULT_LOCALE: Locale = 'es'
const STORAGE_KEY = 'locale'

const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && value in dictionaries

/**
 * Resolves the initial locale: an explicit past choice wins, then the browser's
 * preferred languages, then Spanish. Reading localStorage can throw when the
 * browser blocks storage access, so it is guarded.
 */
const resolveInitialLocale = (): Locale => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    // Storage unavailable (private mode, blocked cookies) — fall through.
  }

  for (const language of navigator.languages ?? [navigator.language]) {
    const base = language.split('-')[0]
    if (isLocale(base)) return base
  }

  return DEFAULT_LOCALE
}

interface LanguageProviderProps {
  children: ReactNode
}

const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [locale, setLocaleState] = useState<Locale>(resolveInitialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Persisting is best-effort; the choice still applies for this session.
    }
  }, [])

  // Keep the document language in sync so screen readers use the right
  // pronunciation and translation tools detect the page correctly.
  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const translate = useCallback(
    (path: string): string => {
      const directory = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE]

      const value = path.split('.').reduce<unknown>((obj, key) => {
        if (obj && typeof obj === 'object' && key in obj) {
          return (obj as Record<string, unknown>)[key]
        }
        return undefined
      }, directory)

      return typeof value === 'string' ? value : path
    },
    [locale],
  )

  const value = useMemo(() => ({ locale, setLocale, translate }), [locale, setLocale, translate])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export default LanguageProvider
