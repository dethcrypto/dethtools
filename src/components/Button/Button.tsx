import { ComponentPropsWithRef, forwardRef } from 'react';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return (
      <button
        {...props}
        ref={ref}
        className={`cursor-pointer rounded-md bg-black px-1 py-4 text-sm text-white
        disabled:cursor-not-allowed disabled:bg-gray-600 ${props.className}`}
      />
    );
  },
);
