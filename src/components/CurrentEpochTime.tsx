import React, {
  ComponentPropsWithoutRef,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';

import { currentEpochTime } from '../lib/currentEpochTime';
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

export function CurrentEpochTime({
  ...props
}: CurrentEpochTimeProps): ReactElement {
  const [state, setState] = React.useState<number>(currentEpochTime.get());
  const [copyNotification, setCopyNotification] = useState(false);

  useInterval(() => {
    return setState(currentEpochTime.get());
  }, 1000);

  return (
    <div className="items-left">
      <div
        className={`mb-2 mt-2 inline-flex cursor-pointer items-center gap-1 rounded-md border 
        border-gray-600 px-3 py-2 text-lg duration-200 hover:bg-gray-700 hover:outline 
        active:bg-gray-800 ${props.className}`}
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
        {...props}
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
  );
}

type CurrentEpochTimeProps = ComponentPropsWithoutRef<'div'>;
