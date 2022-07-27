import React, { ReactElement, ReactNode, useState } from 'react';

import { isHex } from '../lib/decodeHex';
import { CopyIcon } from './icons/CopyIcon';
import { OkIcon } from './icons/OkIcon';
import { Bytes32StringToggle, HexDecToggle, ToggleProps } from './lib/Toggle';

export function NodeBlock({
  children,
  className,
  str,
  nodeType,
}: {
  str: string;
  children?: ReactNode;
  className?: string;
  nodeType?: string;
}): ReactElement {
  const [copyNotification, setCopyNotification] = useState(false);

  const [state, setState] = useState<{ isState: boolean; inner: string }>({
    // it's going to be changed right away, set false naively to avoid type problems
    isState: false,
    inner: str,
  });

  return (
    <div className="flex items-center gap-2">
      <div
        className={`my-1 mx-2 flex h-12 cursor-pointer 
        items-center gap-3 overflow-auto rounded-md pr-4
        font-mono text-sm duration-200 ${className}`}
      >
        <AdequateToggle str={str} state={state} setState={setState} />
        {children}
        <code id="node-type" className="text-purple">
          {nodeType}
        </code>
        <div
          onClick={async (event) => {
            const value =
              event.currentTarget.children.namedItem('node-value')?.textContent;
            if (value) {
              await navigator.clipboard.writeText(value);
              setCopyNotification(true);
              setTimeout(() => {
                setCopyNotification(false);
              }, 1500);
            }
          }}
          className="flex h-10 items-center gap-3 rounded-md border 
          border-gray-600 p-1 px-2 duration-200 hover:bg-gray-700
            hover:outline active:bg-gray-800"
        >
          <code aria-label="decoded value" id="node-value">
            {state.inner}
          </code>
          {!copyNotification ? (
            <CopyIcon className="cursor-pointer" />
          ) : (
            <OkIcon className="delay-300" />
          )}
        </div>
      </div>
    </div>
  );
}

// @internal
type AdequateToggle = Omit<
  ToggleProps<string, string>,
  'isDisabled' | 'isStateFn'
> & {
  str: string;
};

// @internal
// eslint-disable-next-line @typescript-eslint/no-redeclare
function AdequateToggle({
  str,
  state,
  setState,
}: AdequateToggle): ReactElement {
  const isString = isNaN(Number.parseInt(str));

  return isString ? (
    <Bytes32StringToggle
      isStateFn={isHex}
      isDisabled={false}
      state={state}
      setState={setState}
    />
  ) : (
    <HexDecToggle
      isStateFn={isHex}
      isDisabled={false}
      state={state}
      setState={setState}
    />
  );
}
