import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
  simple?: boolean
}

export function Logo({ className, simple = false }: LogoProps) {
  const logoSrc = simple ? "/logo-simple.png" : "/logo.png"

  return (
    <Link href="/">
      <Image
        src={logoSrc || "/placeholder.svg"}
        alt="FP&A Expresso Nepomuceno"
        width={240}
        height={80}
        className={className}
        priority
      />
    </Link>
  )
}
