import { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

export function Entity({
  title,
  children,
  className,
  titleClassName,
  isLoading = false,
  ...props
}: EntityProps): ReactElement {
  return (
    <div
      className={`pb-4
      ${
        isLoading
          ? `before:absolute before:inset-0 before:h-full before:w-full 
            before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r 
            before:from-transparent before:via-gray-600 before:to-transparent`
          : ''
      } ${className}`}
      {...props}
    >
      <p
        className={`text-md font-bold uppercase tracking-widest text-gray-300 ${titleClassName}`}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

// @internal
export interface EntityProps extends ComponentPropsWithoutRef<'div'> {
  title: string;
  isLoading?: boolean;
  children: ReactNode;
  titleClassName?: string;
}
