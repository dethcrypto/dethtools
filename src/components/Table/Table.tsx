import { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

function TableRoot({
  children,
  className,
  ...props
}: TableProps): ReactElement {
  return (
    <div
      className={`relative mt-4 overflow-x-auto rounded-md opacity-75 shadow-md shadow-pink/5 ${className}`}
      {...props}
    >
      <table className="w-full border border-gray-600 text-left text-sm text-gray-200">
        {children}
      </table>
    </div>
  );
}

function Head({ children }: HeadProps): ReactElement {
  return (
    <thead className="bg-gray-50 bg-gray-500 text-xs uppercase text-gray-700">
      <tr className="divide-x divide-gray-600 border-x border-t border-gray-600 bg-gray-700 py-0.5">
        {children}
      </tr>
    </thead>
  );
}

interface HeadProps {
  children: ReactNode;
}

function HeadRow({ children }: HeadRowProps): ReactElement {
  return (
    <th
      scope="row"
      className="whitespace-nowrap py-3 px-4 font-medium text-white"
    >
      {children}
    </th>
  );
}

interface HeadRowProps {
  children: ReactNode;
}

function Rows({ children }: RowsProps): ReactElement {
  return (
    <tbody>
      <tr
        className="divide-x divide-gray-600 border-t border-gray-600 
      bg-gradient-to-tr from-gray-700 to-gray-800"
      >
        {children}
      </tr>
    </tbody>
  );
}

interface RowsProps {
  children: ReactNode;
}

function Row({ children }: RowProps): ReactElement {
  return <td className="border-gray-600 py-3 px-4">{children}</td>;
}

interface RowProps {
  children: ReactNode;
}

export const Table = Object.assign(TableRoot, { Rows, Row, Head, HeadRow });

interface TableProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
}
