import React, { ReactElement, useState } from 'react';

import { FormLabel } from './FormLabel';
import { CopyIcon } from './icons/CopyIcon';
import { OkIcon } from './icons/OkIcon';
import { Input } from './lib/Input';

export interface ConversionInputProps
  extends React.ComponentPropsWithoutRef<'input'> {
  error?: string;
  extraLabel?: React.ReactNode;
}

export function ConversionInput({
  name,
  id = name,
  value,
  error,
  extraLabel,
  ...rest
}: ConversionInputProps): ReactElement {
  const [copyNotification, setCopyNotification] = useState(false);
  return (
    <FormLabel
      htmlFor={id}
      className="relative"
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
      <div className="absolute top-9 right-3">
        {!copyNotification ? (
          <CopyIcon
            onClick={async (event) => {
              let inputValue: string | undefined;
              if (name) {
                inputValue = (
                  event.currentTarget.parentElement?.parentElement?.children[1].children.namedItem(
                    name,
                  ) as HTMLInputElement
                ).value;
              }
              if (inputValue) {
                await navigator.clipboard.writeText(inputValue);
                setCopyNotification(true);
                setTimeout(() => {
                  setCopyNotification(false);
                }, 1500);
              }
            }}
            className="cursor-pointer"
          />
        ) : (
          <OkIcon className="delay-300" />
        )}
      </div>
    </FormLabel>
  );
}
