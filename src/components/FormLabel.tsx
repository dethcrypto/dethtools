import * as React from 'react';

export interface FormLabelProps
  extends React.ComponentPropsWithoutRef<'label'> {
  label: React.ReactNode;
}

export function FormLabel({
  children,
  label,
  className,
  ...rest
}: FormLabelProps) {
  return (
    <label
      className={'flex flex-col gap-2' + (className ? ' ' + className : '')}
      {...rest}
    >
      <div className="flex h-4 gap-1 leading-none">{label}</div>
      {children}
    </label>
  );
}
