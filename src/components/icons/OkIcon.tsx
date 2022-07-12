import React, { ReactElement, SVGProps } from 'react';

export function OkIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M20 7L9.09556 18L4 13.0731"
        stroke="white"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
