import React, { ReactElement, SVGProps } from 'react';

export function LightbulbIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      width={21}
      height={21}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.778 12.87A5.554 5.554 0 0 1 10 2.222a5.555 5.555 0 0 1 2.222 10.646m-4.444 2.686h4.444m-3.628 2.222h2.812m-.163-12.524L8.789 7.706h2.454L8.758 10.19"
        stroke="#AAA4B6"
        strokeWidth={1.25}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
