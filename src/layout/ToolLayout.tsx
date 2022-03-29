import { FC, ReactNode } from 'react';

export const ToolLayout: FC<ReactNode> = ({ children }) => {
  return <div className="flex w-3/5 flex-col gap-4"> {children} </div>;
};
