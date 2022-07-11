import React, { ReactElement, SVGProps } from 'react';

export function CopyIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      width={24}
      height={24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M18.23 9c.593.394.985 1.069.985 1.835v7.114a3 3 0 0 1-3 3h-3.926a1.99 1.99 0 0 1-1.575-.773m-2.925-3.333h4.254a3 3 0 0 0 3-3V6.055a3 3 0 0 0-3-3H7.79a3 3 0 0 0-3 3v7.788a3 3 0 0 0 3 3Z"
        stroke="#ffffff"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
