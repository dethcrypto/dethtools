import { noop } from 'lodash';

import { ValidatorResult } from './validation/validators/result.d';

/**
 * @param newValue
 * @param setState
 * @param validateFn - function that validates the new value 
    (preferably function following validator convention)
    @see src/misc/validation/validators
 * @param flushFn - function to flush the component state (e.g results)
 * @param args - additional arguments to pass to setState function
 * @returns {ValidatorResult}
 */
export function handleChangeValidated({
  newValue,
  setState,
  validateFn,
  flushFn = noop,
  ...args
}: HandleChangeValidatedArgs & AnyArgs): void {
  // flush component results
  flushFn();
  // parse with provided schema
  const validationResult = validateFn(newValue);

  setState({
    ...args,
    value: newValue,
    error: !validationResult.success ? validationResult.error : undefined,
  });
  // clear error if field is empty now
  if (newValue.length === 0)
    setState({ ...args, value: newValue, error: undefined });
}

interface HandleChangeValidatedArgs {
  newValue: string;
  validateFn: (newValue: string) => ValidatorResult;
  setState: (...args: any[]) => void;
  flushFn?: () => void;
}

type AnyArgs = { [key: string]: any };
