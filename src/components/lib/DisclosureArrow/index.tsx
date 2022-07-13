import * as React from 'react';

import { DownArrowIcon } from '../../../components/icons/DownIcon';
import { UpArrowIcon } from '../../../components/icons/UpIcon';

export function DisclosureArrow({ open }: { open: boolean }): JSX.Element {
  return (
    <React.Fragment>
      {!open ? (
        <UpArrowIcon width={12} height={12} />
      ) : (
        <DownArrowIcon width={12} height={12} />
      )}
    </React.Fragment>
  );
}
