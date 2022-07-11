import React, { ReactElement, SVGProps } from 'react';

export function MinusIcon(props: SVGProps<SVGSVGElement>): ReactElement {
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
        d="M2.787 7.486l9.426.001"
        stroke="#AAA4B6"
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
