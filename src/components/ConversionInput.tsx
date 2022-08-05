import React, { ReactElement } from 'react';

import { FormLabel } from './FormLabel';
import { Input } from './lib/Input';

export function ConversionInput({
  name,
  id = name,
  value,
  error,
  extraLabel,
  ...rest
}: ConversionInputProps): ReactElement {
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
      <Input
        id={id}
        type="text"
        placeholder="0"
        value={value}
        error={error}
        {...rest}
      />
    </FormLabel>
  );
}

export interface ConversionInputProps
  extends React.ComponentPropsWithoutRef<'input'> {
  error?: string;
  extraLabel?: React.ReactNode;
}
