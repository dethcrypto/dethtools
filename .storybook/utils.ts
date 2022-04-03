import { Meta } from '@storybook/react';
import { ComponentType } from 'react';

export function meta<P>(
  component: ComponentType<P>,
  rest: Meta<P> = {},
): Meta<P> {
  return {
    title: component.displayName || component.name,
    component,
    ...rest,
  };
}
