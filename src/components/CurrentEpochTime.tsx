import React, { ReactElement, useEffect, useRef, useState } from 'react';

import { CopyIcon } from './icons/CopyIcon';
import { OkIcon } from './icons/OkIcon';

function useInterval(callback: () => void, delay: number): void {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick(): void {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function CurrentEpochTime(): ReactElement {
  const [state, setState] = React.useState<number>(
    Math.floor(new Date().getTime() / 1000),
  );
  const [copyNotification, setCopyNotification] = useState(false);

  function unixEpoch(): number {
    return Math.floor(new Date().getTime() / 1000);
  }

  useInterval(() => {
    return setState(unixEpoch());
  }, 1000);

  return (
    <div className="items-left">
      <div>
        <div
          className="mb-2 mt-2 inline-flex cursor-pointer items-center gap-1 rounded-md border
                   border-gray-600 px-2 py-1 text-lg duration-200
                   hover:bg-gray-700 hover:outline active:bg-gray-800"
          onClick={async (e) => {
            const value = e.currentTarget.children.namedItem(
              'current-unix-epoch-time',
            )?.textContent;
            await navigator.clipboard.writeText(value ?? '');
            setCopyNotification(true);
            setTimeout(() => {
              setCopyNotification(false);
            }, 1500);
          }}
        >
          <p aria-label="current unix epoch time" id="current-unix-epoch-time">
            {state}
          </p>
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
