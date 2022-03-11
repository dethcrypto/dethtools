import Link from 'next/link'
import React from 'react'

interface MyLinkProps {
  href: string
  className?: string
  children: React.ReactNode
}

export const MyLink = ({ className, href, children }: MyLinkProps) => (
  <Link href={href} passHref>
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a className={className || ''}>{children}</a>
  </Link>
)
