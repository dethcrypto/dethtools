import { Transition } from '@headlessui/react';
import { ComponentPropsWithoutRef, ReactElement } from 'react';

export function LoadingEntity({
  isLoading,
  className,
}: LoadingEntityProps): ReactElement {
  return (
    <section aria-busy={isLoading} title="Loading entity" className="flex">
      <Transition
        className={className}
        show={true}
        appear={true}
        enter="transition-opacity duration-1000"
        enterFrom="opacity-50"
        enterTo="opacity-100"
        leave="transition-opacity duration-1000"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className={`relative isolate mt-4 h-8 w-full
          overflow-hidden rounded-md border border-gray-700 
        bg-gray-800 shadow-md shadow-gray-800
        ${
          isLoading
            ? `before:absolute before:inset-0 before:h-full before:w-full 
          before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r 
          before:from-transparent before:via-gray-700 before:to-transparent`
            : ''
        }`}
        />
      </Transition>
    </section>
  );
}

// @internal
export interface LoadingEntityProps extends ComponentPropsWithoutRef<'div'> {
  isLoading: boolean;
}
