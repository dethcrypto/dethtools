import { ReactElement, ReactNode } from 'react';

export interface ToolContainerProps {
  children: ReactNode;
}

export const ToolContainer = ({
  children,
}: ToolContainerProps): ReactElement => {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col sm:mx-auto sm:w-3/5 md:mx-auto">
      {children}
    </div>
  );
};
