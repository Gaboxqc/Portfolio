interface AcademyLogoProps {
  name: string
  imageUrl?: string | null
}

/**
 * The academy's logo, or its initial when none is set.
 *
 * Both cards previously hardcoded the Platzi icon, which was simply wrong for
 * any other provider. The fallback is a letter rather than that icon for the
 * same reason: showing one academy's logo on another's certificate is worse than
 * showing no logo at all.
 */
const AcademyLogo = ({ name, imageUrl }: AcademyLogoProps) => (
  <div className='relative z-10 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/20 outline-1'>
    {imageUrl ? (
      <img
        src={imageUrl}
        // The academy name is already printed on the card, so repeating it here
        // would make screen readers announce it twice.
        alt=''
        loading='lazy'
        decoding='async'
        className='h-full w-full object-contain p-1.5'
      />
    ) : (
      <span aria-hidden='true' className='text-lg font-medium text-primary'>
        {name.trim().charAt(0).toUpperCase() || '?'}
      </span>
    )}
  </div>
)

export default AcademyLogo
