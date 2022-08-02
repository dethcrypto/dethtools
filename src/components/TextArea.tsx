import { ComponentPropsWithoutRef, forwardRef } from 'react';

export interface TextAreaProps extends ComponentPropsWithoutRef<'textarea'> {
  name: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, name, ...props }, ref) => {
    return (
      <>
        <label htmlFor={name}>
          <span>Calldata</span>
        </label>
        <textarea
          id={name}
          aria-label={name}
          aria-invalid={!!error}
          ref={ref}
          className={`h-36 break-words rounded-md border border-gray-600 bg-gray-900 ${
            error && 'border-error/75'
          } ${className}`}
          {...props}
        />
        <p
          aria-label={`${name} error`}
          role="alert"
          className="pt-1 text-right text-error"
        >
          {error}
        </p>
      </>
    );
  },
);

TextArea.displayName = 'TextArea';
