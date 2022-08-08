import { useState, useCallback } from 'react';

export function useToggle(
  initialState = false,
): [boolean, (newValue: boolean) => void] {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState((state) => !state), []);

  return [state, toggle];
}
