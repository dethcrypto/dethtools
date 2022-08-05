import { ComponentPropsWithoutRef, forwardRef } from 'react';

import { FormLabel } from '../../../../src/components/FormLabel';

export interface TextAreaProps extends ComponentPropsWithoutRef<'textarea'> {
  name: string;
  error?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, name, ...props }, ref) => {
    return (
      <>
        <FormLabel
          className="text-white"
          htmlFor={name}
          label={<span>{name}</span>}
        >
          <textarea
            id={name}
            aria-label={name}
            aria-invalid={!!error}
            ref={ref}
            className={`h-36 break-words rounded-md border border-gray-600 bg-gray-900 ring-pink focus:ring-0 ${
              error
                ? 'border-error focus:border-error'
                : 'focus:border-pink focus:caret-pink'
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
        </FormLabel>
      </>
    );
  },
);

TextArea.displayName = 'TextArea';
