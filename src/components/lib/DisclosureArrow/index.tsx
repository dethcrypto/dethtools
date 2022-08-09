import React from 'react';

import { DownArrowIcon } from '../../../components/icons/DownIcon';
import { UpArrowIcon } from '../../../components/icons/UpIcon';

interface DisclosureArrowProps extends React.SVGProps<SVGSVGElement> {
  open: boolean;
}

export function DisclosureArrow({
  open,
  ...props
}: DisclosureArrowProps): JSX.Element {
  const def = { width: props.width || 12, height: props.width || 12 };
  return !open ? (
    <UpArrowIcon {...def} {...props} />
  ) : (
    <DownArrowIcon {...def} {...props} />
  );
}
