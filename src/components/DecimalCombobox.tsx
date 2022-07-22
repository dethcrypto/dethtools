import { Combobox } from '@headlessui/react';
import React, { ReactElement, useState } from 'react';

import { FormLabel } from './FormLabel';

export interface ConversionInputProps
  extends React.ComponentPropsWithoutRef<'input'> {
  error?: string;
  extraLabel?: React.ReactNode;
}

interface PredefinedDecimal {
  name: string;
  value: number;
}

const predefinedDecimals: PredefinedDecimal[] = [
  { name: 'wad', value: 18 },
  { name: 'ray', value: 27 },
  { name: 'rad', value: 45 },
];

export function PredefinedDecimalCombobox({
  name,
  id = name,
  value,
  error,
  extraLabel,
  ...rest
}: ConversionInputProps): ReactElement {
  const [predefinedDecimal, setPredefinedDecimal] = useState<PredefinedDecimal>(
    { value: 0, name: '' },
  );
  const [query, setQuery] = useState('');

  const filteredDecimals =
    query === ''
      ? predefinedDecimals
      : predefinedDecimals.filter((decimal) => {
          return decimal.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <FormLabel
      htmlFor={id}
      label={
        <>
          <span>{name}</span>
          {extraLabel}
        </>
      }
    >
      <Combobox
        as="div"
        value={predefinedDecimal}
        onChange={setPredefinedDecimal}
      >
        <Combobox.Input
          value={predefinedDecimal.value}
          className={
            'w-full rounded-md border border-gray-600 bg-gray-900 ' +
            'p-3.75 text-lg leading-none text-white focus:outline-none ' +
            'invalid:border-error invalid:caret-error ' +
            'disabled:text-white/50 ' +
            (error
              ? 'border-error caret-error '
              : 'focus:border-pink focus:caret-pink ')
          }
          id={id}
          type="text"
          placeholder="0"
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          {...rest}
        />
        <Combobox.Options className="border-gray-500 bg-gray-700">
          {filteredDecimals.map((decimal) => (
            <Combobox.Option
              className="cursor-pointer p-2"
              key={decimal.value}
              value={decimal.name}
            >
              <p>
                {decimal.name} ({decimal.value})
              </p>
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
    </FormLabel>
  );
}
