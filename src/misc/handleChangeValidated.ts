import { WithError } from './types';

export function handleChangeValidated({
  newValue,
  setState,
  validateFn,
  flushFn,
}: HandleChangeValidatedArgs): void {
  // flush component results
  flushFn();
  // parse with provided schema
  const validationResult = validateFn(newValue);

  setState({
    value: newValue,
    error: !validationResult.success ? validationResult.error : undefined,
  });
  // clear error if field is empty now
  if (newValue.length === 0) setState({ value: newValue, error: undefined });
}

interface HandleChangeValidatedArgs {
  newValue: string;
  validateFn: (
    newValue: string,
  ) => { success: true; error: undefined } | { success: false; error: string };
  setState: (value: WithError<string>) => void;
  flushFn: () => void;
}
