/* eslint-disable jsx-a11y/anchor-is-valid */

import Link from 'next/link';
import React, { ReactElement } from 'react';

interface MyLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export const MyLink = ({
  className,
  href,
  children,
}: MyLinkProps): ReactElement => (
  <Link href={href} passHref>
    <a className={className || ''}>{children}</a>
  </Link>
);
