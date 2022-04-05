import * as React from 'react';

export function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={18}
      height={18}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.672 6.75c.445.295.74.801.74 1.376v5.335a2.25 2.25 0 0 1-2.25 2.25H9.216c-.48 0-.908-.227-1.182-.58m-2.193-2.5h3.19a2.25 2.25 0 0 0 2.25-2.25v-5.84a2.25 2.25 0 0 0-2.25-2.25h-3.19a2.25 2.25 0 0 0-2.25 2.25v5.84a2.25 2.25 0 0 0 2.25 2.25Z"
        stroke="#938D9E"
        strokeWidth={1.125}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
