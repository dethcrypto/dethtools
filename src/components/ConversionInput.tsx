import * as React from 'react';

import { Input } from './lib/Input';

export interface ConversionInputProps
  extends React.ComponentPropsWithoutRef<'input'> {
  error?: string;
  extraLabel?: React.ReactNode;
}

export function ConversionInput({
  name,
  value,
  error,
  extraLabel,
  ...rest
}: ConversionInputProps) {
  return (
    <label htmlFor={name} className="flex flex-col gap-2">
      <div className="flex h-4 gap-1 leading-none">
        <span>{name}</span>
        {extraLabel}
      </div>

      <Input
        id={name}
        type="text"
        placeholder="0"
        value={value}
        error={error}
        {...rest}
      />
    </label>
  );
}
