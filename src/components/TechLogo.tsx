import Image from 'next/image'

interface TechLogoProps {
  slug: string
  name: string
  size?: number
  className?: string
}

export function TechLogo({ slug, name, size = 40, className = '' }: TechLogoProps) {
  return (
    <Image
      src={`https://cdn.simpleicons.org/${slug}`}
      alt={`Logo ${name}`}
      width={size}
      height={size}
      className={className}
    />
  )
}
