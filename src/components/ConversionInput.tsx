import React, { ReactElement } from 'react';

import { FormLabel } from './FormLabel';
import { Input } from './lib/Input';

export function ConversionInput({
  name,
  id = name,
  value,
  error,
  message,
  extraLabel,
  labelClassName,
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
      className={labelClassName}
    >
      <Input
        id={id}
        type="text"
        placeholder="0"
        value={value}
        error={error}
        message={message}
        {...rest}
      />
    </FormLabel>
  );
}

export interface ConversionInputProps
  extends React.ComponentPropsWithoutRef<'input'> {
  labelClassName?: React.ComponentPropsWithoutRef<'input'>['className'];
  error?: string;
  message?: string;
  extraLabel?: React.ReactNode;
}
