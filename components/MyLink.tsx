import Link from 'next/link'
import React from 'react'

interface MyLinkProps {
  href: string
  as: string
  className?: string
  children: React.ReactNode
}

const MyLink = ({ className, href, as, children }: MyLinkProps) => (
  <Link href={href} as={as} passHref>
    <a className={className || ''}>{children}</a>
  </Link>
)

export default MyLink
