import { Listbox } from '@headlessui/react';
import { useEffect, useState } from 'react';

import { decodeHex, encodeHex, isHex } from '../lib/decodeHex';

type FormatType = 'hex' | 'dec';

export function NodeBlock({
  children,
  className,
  str,
}: {
  str: string;
  children?: any;
  className?: string;
}) {
  const formats: Array<{ id: number; name: FormatType }> = [
    { id: 1, name: 'hex' },
    { id: 2, name: 'dec' },
  ];

  const [currentFormat, setCurrentFormat] = useState(() =>
    isHex(str) ? formats[0] : formats[1],
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
          {currentFormat.name}
        </Listbox.Button>

        <Listbox.Options>
          <div className="flex items-center">
            {formats
              .filter((fmt) => fmt.id !== currentFormat.id)
              .map((fmt) => (
                <Listbox.Option
                  as="ul"
                  className={`m-0 flex cursor-pointer items-center rounded-md
                    border border-deth-gray-600 p-0
                    px-2 duration-200 hover:bg-deth-gray-700 hover:shadow-md
                    hover:shadow-pink/25 hover:outline hover:outline-2
                    active:bg-deth-gray-800 ${className}`}
                  key={fmt.id}
                  value={fmt}
                >
                  {fmt.name}
                </Listbox.Option>
              ))}
          </div>
        </Listbox.Options>
      </Listbox>

      {children}
      <b id="node-value">{formatNodeValue(currentFormat.name, str)}</b>
    </div>
  );
}
