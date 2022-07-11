import React, { ReactElement, SVGProps } from 'react';

export function GithubIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      width={21}
      height={21}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_188_924)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.291 0a10.291 10.291 0 00-3.254 20.058c.519.095.702-.227.702-.499v-1.75c-2.875.625-3.481-1.384-3.481-1.384a2.755 2.755 0 00-1.144-1.51c-.928-.631.076-.631.076-.631a2.167 2.167 0 011.573 1.061 2.198 2.198 0 002.995.86c.04-.52.263-1.009.631-1.378-2.287-.259-4.687-1.143-4.687-5.054a3.98 3.98 0 011.055-2.76 3.753 3.753 0 01.1-2.723s.866-.278 2.831 1.055a9.735 9.735 0 015.155 0c1.965-1.333 2.824-1.055 2.824-1.055.38.853.424 1.818.127 2.703a3.98 3.98 0 011.055 2.761c0 3.955-2.407 4.82-4.7 5.054a2.433 2.433 0 01.7 1.895v2.824c0 .335.184.594.708.493A10.291 10.291 0 0010.291 0z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_188_924">
          <path fill="#fff" d="M0 0H20.5825V20.0708H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
