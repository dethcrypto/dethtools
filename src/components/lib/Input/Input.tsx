import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { constrain } from '../../../misc/constrain';

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  error?: string;
}

/**
 * Most inputs in the application will serve as numeric value inputs
 * without need for autocomplete or spellcheck.
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
  ({ className, error, autoComplete = 'off', ...rest }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          aria-invalid={!!error}
          {...(autoComplete === 'off' && autoCompleteProps)}
          className={
            'w-full rounded-md border border-gray-600 bg-gray-900 ' +
            'p-3.75 text-lg leading-none text-white focus:outline-none ' +
            'invalid:border-error invalid:caret-error ' +
            'disabled:text-white/50 ' +
            (error
              ? 'border-error caret-error '
              : 'focus:border-pink focus:caret-pink ') +
            (className ? ` ${className}` : '')
          }
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
