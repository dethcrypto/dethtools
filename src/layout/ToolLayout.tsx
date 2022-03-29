import { FC, ReactNode } from 'react';

export const ToolLayout: FC<ReactNode> = ({ children }) => {
  return (
    <div className="mx-auto flex w-full flex-col gap-4 sm:mx-auto sm:w-3/5 md:mx-auto md:w-full">
      {' '}
      {children}{' '}
    </div>
  );
};
