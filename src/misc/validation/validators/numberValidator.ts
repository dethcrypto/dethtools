import { zodResultMessage } from '../../../../src/misc/zodResultMessage';
import { decimalSchema } from '../schemas/decimalSchema';
import { ValidatorResult } from './result';

export function numberValidator(newValue: string): ValidatorResult {
  const validated = decimalSchema.safeParse(newValue);
  if (validated.success) return { success: true };
  else return { success: false, error: zodResultMessage(validated) };
}
