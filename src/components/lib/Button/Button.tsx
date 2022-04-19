import { ComponentPropsWithRef, forwardRef } from 'react';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: keyof typeof variants;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', disabled, ...rest }, ref) => {
    return (
      <button
        {...rest}
        disabled={disabled}
        ref={ref}
        className={
          'bg-black cursor-pointer rounded-md px-4 py-3 text-white ' +
          'disabled:cursor-not-allowed disabled:bg-gray-600 ' +
          'transition-shadow ' +
          'hover:outline hover:outline-2 ' +
          (!disabled
            ? 'transition active:scale-95 active:duration-100 '
            : ' ') +
          variants[variant] +
          (className ? ` ${className}` : '')
        }
      />
    );
  },
);

/** @internal */
export const variants = {
  primary:
    'bg-gradient-to-r from-pink to-purple hover:outline-gray-50 ' +
    'hover:shadow-lg hover:shadow-pink/25',
  secondary: 'bg-gray-600 text-gray-300 hover:shadow-lg hover:shadow-white/10',
  tertiary: 'border border-gray-600 bg-gray-900 text-gray-400',
  text: '',
};
