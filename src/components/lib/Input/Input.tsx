import { ComponentPropsWithoutRef, forwardRef, useState } from 'react';

import { constrain } from '../../../misc/constrain';

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  error?: string;
}

/**
 * Inputs in the application will have no need for autocomplete or spellcheck.
 *
 * Whenever `autoComplete` prop on `Input` is not set to a value other than
 * `"off"`, we also use all of the other props below.
 */
const autoCompleteProps = constrain<InputProps>()({
  autoComplete: 'off',
  autoCorrect: 'off',
  spellCheck: 'false',
  // Disable LastPass widget
  'data-lpignore': 'true',
});

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      name,
      error: errorFromProps,
      autoComplete = 'off',
      onChange,
      ...rest
    },
    ref,
  ) => {
    const [validationMessage, setValidationMessage] = useState<
      string | undefined
    >();

    const error = errorFromProps || validationMessage;

    return (
      <div>
        <input
          name={name}
          ref={ref}
          aria-invalid={!!errorFromProps}
          {...(autoComplete === 'off' && autoCompleteProps)}
          className={`w-full rounded-md border-gray-600 bg-gray-900 p-3.75 pr-12 text-lg 
            leading-none text-white ring-pink invalid:border-error invalid:caret-error
            focus:outline-none focus:ring-0
            disabled:text-white/50
            ${
              errorFromProps
                ? 'border-error caret-error '
                : 'focus:border-pink focus:caret-pink '
            } ${className}`}
          onChange={(event) => {
            onChange?.(event);
            const validationMessage = event.target.validationMessage;
            if (validationMessage) setValidationMessage(validationMessage);
            // otherwise error validation message would stay here despite lack of the error
            else setValidationMessage(undefined);
          }}
          {...rest}
        />
        <div className="whitespace-normal pt-2">
          {error && (
            <p role="alert" aria-atomic="true" className="text-error">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  },
);
