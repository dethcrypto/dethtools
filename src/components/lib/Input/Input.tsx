import { ComponentPropsWithoutRef, forwardRef } from 'react';

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...rest }, ref) => {
    return (
      <div>
        <input
          ref={ref}
          aria-invalid={!!error}
          className={
            'h-10 w-full rounded-md border border-gray-600 bg-gray-900 text-sm ' +
            'p-4 text-white focus:outline-none ' +
            'invalid:border-error invalid:caret-error ' +
            'disabled:text-white/50 ' +
            (error
              ? 'border-error caret-error '
              : 'focus:border-pink focus:caret-pink ') +
            (className ? ` ${className}` : '')
          }
          {...rest}
        />
        <div className="pt-2">
          {error && <p className="text-error">{error}</p>}
        </div>
      </div>
    );
  },
);
