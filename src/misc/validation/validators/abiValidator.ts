import { parseAbi } from '../../../../src/lib/parseAbi';
import { parseEthersErrorMessage } from '../../../../src/misc/parseEthersErrorMessage';
import { ValidatorResult } from './result';

export function abiValidator(newValue: string): ValidatorResult {
  try {
    parseAbi(newValue);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: parseEthersErrorMessage((error as Error).message),
    };
  }
}
