import { ComponentPropsWithRef, forwardRef } from 'react';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: keyof typeof variants;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={`bg-black cursor-pointer rounded-md px-1 py-4 text-sm text-white
      disabled:cursor-not-allowed disabled:bg-gray-600 ${props.className}`}
      />
    );
  },
);

const variants = {
  primary: 'bg-gradient-to-r from-deth-pink to-deth-purple',
  secondary: 'bg-deth-gray-600 text-deth-gray-300',
  tertiary: 'border border-deth-gray-400 bg-deth-gray-900',
};
