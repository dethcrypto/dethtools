import { BigNumber } from '@ethersproject/bignumber';
import React, {
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import { decodeHex, encodeHex, isHex } from '../lib/decodeHex';
import { CopyIcon } from './icons/CopyIcon';
import { OkIcon } from './icons/OkIcon';

function HexDecToggle({
  setIsHex,
  state,
  isDisabled,
}: {
  isDisabled: boolean;
  state: { isHex: boolean; value: string };
  setIsHex: Dispatch<SetStateAction<{ isHex: boolean; value: string }>>;
}): ReactElement {
  const { isHex, value } = state;
  const switchButtonStyle =
    'grow-0 cursor-pointer border bg-gray-800 ' +
    'border-gray-500 bg-gray-600 py-0.5 px-3 ' +
    String(isDisabled && ' opacity-30 cursor-not-allowed ') +
    'duration-200 hover:bg-gray-700 active:bg-gray-800 ';

  return (
    <div className="flex">
      <button
        disabled={isDisabled}
        onClick={() => setIsHex({ isHex: true, value: encodeHex(value) })}
        className={
          switchButtonStyle +
          'rounded-l-md border-r ' +
          String(isHex && !isDisabled && 'border-gray-100')
        }
      >
        hex
      </button>
      <button
        disabled={isDisabled}
        onClick={() => setIsHex({ isHex: false, value: decodeHex(value) })}
        className={
          switchButtonStyle +
          'rounded-r-md border-l ' +
          String(!isHex && !isDisabled && 'border-gray-100')
        }
      >
        dec
      </button>
    </div>
  );
}

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
  const [state, setState] = useState<{ isHex: boolean; value: string }>({
    isHex: isHex(str),
    value: str,
  });

  function isStringBigNumber(str: string): boolean {
    try {
      BigNumber.from(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  useEffect(() => {
    if (isHex(str)) {
      setState({ isHex: true, value: encodeHex(str) });
    } else {
      setState({ isHex: false, value: decodeHex(str) });
    }
  }, [str]);

  return (
    <div className="flex items-center gap-2">
      <div
        className={`my-1 mx-2 flex h-12 cursor-pointer 
        items-center gap-3 overflow-auto rounded-md pr-4
        font-mono text-sm duration-200 ${className}`}
      >
        <HexDecToggle
          isDisabled={!(isHex(str) || isStringBigNumber(str))}
          state={state}
          setIsHex={setState}
        />
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
            {state.value}
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
