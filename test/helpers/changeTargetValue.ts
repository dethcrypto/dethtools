import { fireEvent } from '@testing-library/react';

export function changeTargetValue(field: HTMLElement, value: string): void {
  fireEvent.change(field, {
    target: {
      value,
    },
  });
}
