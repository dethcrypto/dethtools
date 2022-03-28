import { ComponentPropsWithRef, forwardRef } from 'react'

export interface ButtonProps extends ComponentPropsWithRef<'button'> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  return (
    <button
      {...props}
      ref={ref}
      className={`text-smtext-white w-full cursor-pointer rounded-md bg-gradient-to-r from-deth-pink
       to-deth-purple px-1 py-2 disabled:cursor-not-allowed disabled:bg-deth-gray-600 ${props.className}`}
    />
  )
})
