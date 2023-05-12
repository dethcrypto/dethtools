import { zodResultMessage } from '../../../../src/misc/zodResultMessage';
import { addressSchema } from '../schemas/addressSchema';
import { ValidatorResult } from './result';

export function addressValidator(newValue: string): ValidatorResult {
  const validated = addressSchema.safeParse(newValue);
  if (validated.success) return { success: true };
  else return { success: false, error: zodResultMessage(validated) };
}
