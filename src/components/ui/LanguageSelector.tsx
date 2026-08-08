import * as Select from '@radix-ui/react-select'
import useLanguage from '../../hooks/useLanguage'
import type { Locale } from '../../context/LanguageContext'

const languages: { code: Locale; name: string; flag: string }[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
]

const LanguageSelector = () => {
  const { locale, setLocale, translate } = useLanguage()

  return (
    <Select.Root value={locale} onValueChange={(value) => setLocale(value as Locale)}>
      <Select.Trigger
        aria-label={translate('navbar.language')}
        className='flex cursor-pointer items-center gap-2 rounded-xl border border-primary/40 bg-card px-4 py-2 hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:px-7'
      >
        <svg
          aria-hidden='true'
          className='h-4 w-4 text-muted-foreground'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M3.6 9h16.8M3.6 15h16.8M12 3a18.9 18.9 0 004.9 9c-.9 3.2-2.4 6.5-4.9 9m0-18a18.9 18.9 0 01-4.9 9c.9 3.2 2.4 6.5 4.9 9'
          />
        </svg>
        <Select.Value placeholder={'Español'} />
        <Select.Icon className='ml-1 text-muted-foreground'>
          <svg
            aria-hidden='true'
            className='h-3 w-3 transition-transform duration-200'
            fill='none'
            stroke='currentColor'
            strokeWidth='2.5'
            viewBox='0 0 24 24'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
          </svg>
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position='popper'
          sideOffset={8}
          className='rounded-2xl border border-primary/30 bg-card px-2 py-2 text-muted-foreground shadow-xl'
        >
          <Select.Viewport>
            {languages.map((language) => {
              return (
                <Select.Item
                  key={language.code}
                  value={language.code}
                  className='flex cursor-pointer items-center justify-between rounded-xl p-3 px-5 text-muted-foreground transition-colors outline-none hover:bg-primary/20 data-[state=checked]:text-accent'
                >
                  <div className='flex items-center gap-3'>
                    <span aria-hidden='true' className='text-base'>
                      {language.flag}
                    </span>
                    <Select.ItemText>{language.name}</Select.ItemText>
                  </div>
                  <Select.ItemIndicator className='ml-4 hidden shrink-0 md:block'>
                    <div className='h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_#00d2ff]' />
                  </Select.ItemIndicator>
                </Select.Item>
              )
            })}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

export default LanguageSelector
