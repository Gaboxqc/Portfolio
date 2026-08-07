import type { Translation } from '../types'

const EMPTY_TRANSLATION: Translation = { language_code: '', title: '', description: '' }

function getTranslation(translations: Translation[] = [], locale: string): Translation {
  return (
    translations.find((t) => t.language_code === locale) ??
    translations.find((t) => t.language_code === 'en') ??
    translations[0] ??
    EMPTY_TRANSLATION
  )
}

export default getTranslation
