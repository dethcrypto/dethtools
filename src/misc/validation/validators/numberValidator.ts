import _ from 'lodash';
import { ZodTypeAny } from 'zod';

import { zodResultMessage } from '../../../../src/misc/zodResultMessage';
import { decimalSchema } from '../schemas/decimalSchema';
import { ValidatorResult } from './result';

export function numberValidator(
  newValue: string,
  enhanceSchema: (schema: ZodTypeAny) => ZodTypeAny = _.identity,
): ValidatorResult {
  const validated = enhanceSchema(decimalSchema).safeParse(newValue);
  if (validated.success) return { success: true };
  else return { success: false, error: zodResultMessage(validated) };
}
