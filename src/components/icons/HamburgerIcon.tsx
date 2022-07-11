import React, { ReactElement, SVGProps } from 'react';

export function HamburgerIcon(props: SVGProps<SVGSVGElement>): ReactElement {
  return (
    <svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9 9.75a1.25 1.25 0 100 2.5v-2.5zm22.223 2.5a1.25 1.25 0 100-2.5v2.5zM9 18.637a1.25 1.25 0 100 2.5v-2.5zm22.223 2.5a1.25 1.25 0 000-2.5v2.5zM9 27.523a1.25 1.25 0 000 2.5v-2.5zm22.223 2.5a1.25 1.25 0 100-2.5v2.5zM9 12.25h22.223v-2.5H9v2.5zm0 8.887h22.223v-2.5H9v2.5zm0 8.886h22.223v-2.5H9v2.5z"
        fill="#FF34F0"
      />
    </svg>
  );
}
