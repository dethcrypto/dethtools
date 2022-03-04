import Link from 'next/link'
import React from 'react'

interface MyLink {
  href: string
  as: string
  className?: string
  children: React.ReactNode
}

const MyLink = ({ className, href, as, children }: MyLink) => (
  <Link href={href} as={as} passHref>
    <a className={className || ''}>{children}</a>
  </Link>
)

export default MyLink
