import React, { ReactElement, SVGProps } from 'react';

export function PlusIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.5 2.773v4.714m0 0v4.712m0-4.712H2.787m4.713 0h4.713"
        stroke="#AAA4B6"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
