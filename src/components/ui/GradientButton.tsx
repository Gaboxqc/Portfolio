import { Link } from 'react-router'

interface GradientButtonProps {
  label: string
  nav: string
}

const GradientButton = ({ label, nav }: GradientButtonProps) => {
  return (
    <Link
      to={nav}
      className={
        'flex h-13 w-auto cursor-pointer items-center justify-center rounded-lg bg-linear-to-r from-primary to-accent px-6 text-white shadow-accent/60 hover:shadow-lg'
      }
    >
      {label}
    </Link>
  )
}

export default GradientButton
