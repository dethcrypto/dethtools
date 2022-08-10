import React, { ReactElement } from 'react';

export function FormLabel({
  children,
  label,
  className,
  hideLabel = false,
  ...rest
}: FormLabelProps): ReactElement {
  return (
    <label
      className={'flex flex-col gap-2' + (className ? ' ' + className : '')}
      {...rest}
    >
      <div
        className={`${hideLabel ? 'hidden' : ''} flex h-4 gap-1 leading-none`}
      >
        {label}
      </div>
      {children}
    </label>
  );
}

export interface FormLabelProps
  extends React.ComponentPropsWithoutRef<'label'> {
  label: React.ReactNode;
  hideLabel?: boolean;
}
