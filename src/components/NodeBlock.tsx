import { Listbox } from '@headlessui/react';
import React, { useState } from 'react';

import { decodeHex, encodeHex, isHex } from '../lib/decodeHex';
import { CopyIcon } from './icons/CopyIcon';
import { OkIcon } from './icons/OkIcon';

type FormatType = 'hex' | 'dec';
const formatTypes: FormatType[] = ['hex', 'dec'];

export function NodeBlock({
  children,
  className,
  str,
}: {
  str: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const [copyNotification, setCopyNotification] = useState(false);
  const [currentFormat, setCurrentFormat] = useState<FormatType>(() =>
    isHex(str) ? 'hex' : 'dec',
  );

  function formatNodeValue(format: FormatType, value: string) {
    if (format === 'dec') return decodeHex(value);
    else return encodeHex(value);
  }

  return (
    <div className="flex items-center gap-2">
      <div
        onClick={(e) => {
          const value =
            e.currentTarget.children.namedItem('node-value')?.textContent;
          void navigator.clipboard.writeText(value ?? '');

          setCopyNotification(true);
          setTimeout(() => {
            setCopyNotification(false);
          }, 1500);
        }}
        className={`my-1 mx-1 flex cursor-pointer items-center gap-3 overflow-auto rounded-md border
      border-gray-600 pr-4 font-mono text-sm
        duration-200 hover:bg-gray-700 hover:shadow-md
      hover:shadow-pink/25 hover:outline hover:outline-2 active:scale-105
      active:bg-gray-800 ${className}`}
      >
        <Listbox value={currentFormat} onChange={setCurrentFormat}>
          <Listbox.Button
            as="button"
            className={`ml-3 grow-0 cursor-pointer items-center rounded-md
                      py-0.5 px-1 pr-4 duration-200 hover:bg-gray-700
                      hover:shadow-md hover:shadow-pink/25 hover:outline hover:outline-2
                      active:bg-gray-800 ${className}`}
          >
            {currentFormat}
          </Listbox.Button>

          <Listbox.Options as="ul">
            <div className="flex items-center">
              {formatTypes
                .filter((fmt) => fmt !== currentFormat)
                .map((fmt) => (
                  <Listbox.Option
                    as="ul"
                    className={`m-2 flex cursor-pointer items-center rounded-md border
                  border-gray-600 p-0
                  px-2 duration-200 hover:bg-gray-700 hover:shadow-md
                  hover:shadow-pink/25 hover:outline hover:outline-2
                  active:bg-gray-800 ${className}`}
                    key={fmt}
                    value={fmt}
                  >
                    {fmt}
                  </Listbox.Option>
                ))}
            </div>
          </Listbox.Options>
        </Listbox>

        {children}
        <code id="node-value">{formatNodeValue(currentFormat, str)}</code>
      </div>
      {!copyNotification ? (
        <CopyIcon className="cursor-pointer" />
      ) : (
        <OkIcon className="delay-300" />
      )}
    </div>
  );
}
