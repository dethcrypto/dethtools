import { ReactNode } from 'react';

export interface ToolContainerProps {
  children: ReactNode;
}

export const ToolContainer = ({ children }: ToolContainerProps) => {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 sm:mx-auto sm:w-3/5 md:mx-auto md:w-full">
      {children}
    </div>
  );
};
