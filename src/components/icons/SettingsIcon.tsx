import React, { ReactElement, SVGProps } from 'react';

export function SettingsIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      width={13}
      height={15}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.768 7.5c0-.32-.038-.631-.105-.931l.705-.682a1.067 1.067 0 0 0-1.036-1.793l-.944.27a4.26 4.26 0 0 0-1.615-.938l-.237-.95a1.067 1.067 0 0 0-2.071 0l-.238.95a4.25 4.25 0 0 0-1.61.935l-.952-.272A1.066 1.066 0 0 0 2.63 5.882l.708.684a4.259 4.259 0 0 0-.105.934c0 .319.037.628.104.927l-.71.686a1.067 1.067 0 0 0 1.036 1.793l.949-.271a4.26 4.26 0 0 0 1.609.938l.238.951a1.067 1.067 0 0 0 2.071 0l.237-.948a4.27 4.27 0 0 0 1.617-.935l.946.27a1.067 1.067 0 0 0 1.035-1.793l-.703-.68c.067-.302.106-.616.106-.938ZM7.5 9.166a1.667 1.667 0 1 1 .001-3.333 1.667 1.667 0 0 1 0 3.333Z"
        stroke="#AAA4B6"
        strokeWidth={1}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
