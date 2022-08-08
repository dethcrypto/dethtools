import { zodResultMessage } from '../../../../src/misc/zodResultMessage';
import { stringSchema } from '../schemas/stringSchema';
import { ValidatorResult } from './result';

export function stringValidator(newValue: string): ValidatorResult {
  const validated = stringSchema.safeParse(newValue);
  if (validated.success) return { success: true };
  else return { success: false, error: zodResultMessage(validated) };
}
