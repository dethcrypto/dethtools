import { zodResultMessage } from '../../../../src/misc/zodResultMessage';
import { hexSchema } from '../schemas/hexSchema';

import { ValidatorResult } from './result';

export function hexValidator(newValue: string): ValidatorResult {
  const validated = hexSchema.safeParse(newValue);
  if (validated.success) return { success: true };
  else return { success: false, error: zodResultMessage(validated) };
}
