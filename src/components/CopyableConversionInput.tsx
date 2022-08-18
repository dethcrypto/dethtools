import {
  ComponentPropsWithoutRef,
  Dispatch,
  ReactElement,
  SetStateAction,
  useState,
} from 'react';

import { ConversionInput, ConversionInputProps } from './ConversionInput';
import { CopyIcon } from './icons/CopyIcon';
import { OkIcon } from './icons/OkIcon';

export function CopyableConversionInput({
  name,
  error,
  extraLabel,
  ...props
}: ConversionInputProps): ReactElement {
  const [wasCopied, setWasCopied] = useState(false);

  return (
    <div className={`relative ${props.className}`}>
      <ConversionInput
        {...props}
        name={name}
        error={error}
        extraLabel={extraLabel}
      />
      <InputCopy
        name={name}
        useState={[wasCopied, setWasCopied]}
        className="absolute top-9 right-3"
      />
    </div>
  );
}

// @internal
interface InputCopyProps extends ComponentPropsWithoutRef<'div'> {
  useState: [boolean, Dispatch<SetStateAction<boolean>>];
  name: string | undefined;
}

// @internal
function InputCopy({ name, useState, ...props }: InputCopyProps): ReactElement {
  const [wasCopied, setWasCopied] = useState;

  return (
    <div {...props}>
      {!wasCopied ? (
        <CopyIcon
          className="cursor-pointer"
          onClick={async () => {
            let inputValue: string | undefined;
            if (name)
              inputValue = (document.getElementById(name) as HTMLInputElement)
                .value;
            else throw new Error('Copyable ConversionInput must have a name');
            if (inputValue) {
              void window.navigator.clipboard.writeText(inputValue);
              setWasCopied(true);
              setTimeout(() => setWasCopied(false), 1500);
            }
          }}
        />
      ) : (
        <OkIcon className="delay-300" />
      )}
    </div>
  );
}
