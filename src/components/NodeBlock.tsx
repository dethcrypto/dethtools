import { Listbox } from '@headlessui/react';
import React, { useState } from 'react';

import { decodeHex, encodeHex, isHex } from '../lib/decodeHex';

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
  const [currentFormat, setCurrentFormat] = useState<FormatType>(() =>
    isHex(str) ? 'hex' : 'dec',
  );

  function formatNodeValue(format: FormatType, value: string) {
    if (format === 'dec') return decodeHex(value);
    else return encodeHex(value);
  }

  return (
    <div
      className={`flex cursor-pointer items-center gap-3 overflow-auto
      rounded-md border border-deth-gray-600 duration-200
      hover:bg-deth-gray-700 hover:shadow-md hover:shadow-pink/25
      hover:outline hover:outline-2
    active:bg-deth-gray-800 ${className}`}
    >
      <Listbox value={currentFormat} onChange={setCurrentFormat}>
        <Listbox.Button
          className={`ml-3 flex cursor-pointer items-center rounded-md border
                      border-deth-gray-600 px-2 duration-200 hover:bg-deth-gray-700 hover:shadow-md
                      hover:shadow-pink/25 hover:outline hover:outline-2
                      active:bg-deth-gray-800 ${className}`}
        >
          {currentFormat}
        </Listbox.Button>

        <Listbox.Options>
          <div className="flex items-center">
            {formatTypes
              .filter((fmt) => fmt !== currentFormat)
              .map((fmt) => (
                <Listbox.Option
                  as="ul"
                  className={`m-0 flex cursor-pointer items-center rounded-md
                    border border-deth-gray-600 p-0
                    px-2 duration-200 hover:bg-deth-gray-700 hover:shadow-md
                    hover:shadow-pink/25 hover:outline hover:outline-2
                    active:bg-deth-gray-800 ${className}`}
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
      <b id="node-value">{formatNodeValue(currentFormat, str)}</b>
    </div>
  );
}
