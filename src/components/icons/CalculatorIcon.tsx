import React, { ComponentPropsWithoutRef, ReactElement } from 'react';

export function CalculatorIcon(
  props: ComponentPropsWithoutRef<'svg'>,
): ReactElement {
  return (
    <svg
      width={19}
      height={19}
      viewBox="0 0 13 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.08 14.428h-.643.643zm-8-10.642a.643.643 0 000 1.286V3.786zm4.572 1.286a.643.643 0 000-1.286v1.286zm-4.24 7.952a.643.643 0 00-.674 1.094l.675-1.094zm-.672 1.095a.643.643 0 00.674-1.094l-.674 1.094zm.673-3.38a.643.643 0 00-.675 1.095l.675-1.094zm-.673 1.097a.643.643 0 00.674-1.095l-.674 1.095zm.673-3.38a.643.643 0 00-.675 1.095l.675-1.095zM3.74 9.552a.643.643 0 10.674-1.095L3.74 9.552zm2.963-1.096a.643.643 0 00-.675 1.095l.675-1.095zM6.03 9.552a.643.643 0 10.675-1.095L6.03 9.552zm.673 1.188a.643.643 0 00-.675 1.095l.675-1.095zm-.673 1.096a.643.643 0 00.675-1.095l-.675 1.095zm.673 1.188a.643.643 0 00-.675 1.094l.675-1.094zm-.673 1.095a.643.643 0 00.675-1.094l-.675 1.094zm2.964-5.663a.643.643 0 00-.674 1.095l.674-1.095zm-.672 1.096a.643.643 0 00.674-1.095l-.674 1.095zm-.294 4.026a.643.643 0 001.285 0H8.028zm1.285-2.294a.643.643 0 00-1.285 0h1.285zm.196 5.073H3.222v1.286H9.51v-1.286zm-6.287 0a1.929 1.929 0 01-1.929-1.929H.007a3.215 3.215 0 003.215 3.215v-1.286zm-1.929-1.929V3.572H.007v10.856h1.286zm0-10.856c0-1.066.864-1.93 1.93-1.93V.358A3.215 3.215 0 00.006 3.572h1.286zm1.93-1.93h6.286V.358H3.222v1.286zm6.286.001c1.065 0 1.928.863 1.928 1.929h1.286A3.215 3.215 0 009.51.357v1.286zm1.928 1.929v10.856h1.286V3.572h-1.286zm0 10.857a1.928 1.928 0 01-1.928 1.928v1.286a3.213 3.213 0 003.214-3.215h-1.286zM4.08 5.072h4.573V3.786H4.08v1.286zm-.341 9.046l.002.001.674-1.094-.001-.001-.675 1.094zm0-2.284l.002.002.674-1.095-.001-.001-.675 1.095zm0-2.283h.002l.674-1.094-.001-.001-.675 1.095zm2.29 0h.002l.675-1.094-.002-.001-.675 1.095zm0 2.284h.002l.675-1.094-.002-.001-.675 1.095zm0 2.283l.002.001.675-1.094-.002-.001-.675 1.094zM8.32 9.551h.002l.674-1.094-.002-.001-.674 1.095zm.993 4.027v-2.294H8.028v2.294h1.285z"
        fill="#AAA4B6"
      />
    </svg>
  );
}
