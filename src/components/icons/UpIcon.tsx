import React, { ReactElement, SVGProps } from 'react';

const DEFAULT_SIZE = 30;

export function UpArrowIcon(properties: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      width={properties.width ?? DEFAULT_SIZE}
      height={properties.height ?? DEFAULT_SIZE}
      viewBox="0 0 256 256"
      fill={`${properties.fill ?? 'none'}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M128 11C81.9181 57.0819 56.0819 82.9181 10 129M128 11L246 129M128 11V248"
        stroke="white"
        strokeWidth="8"
      />
    </svg>
  );
}
