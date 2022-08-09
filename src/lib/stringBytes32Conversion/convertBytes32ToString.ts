import { parseBytes32String } from '@ethersproject/strings';

import { parseEthersErrorMessage } from '../../../src/misc/parseEthersErrorMessage';
import { capitalizeFirstLetter } from '../capitalizeFirstLetter';
import { ConvertFunctionWithError } from './types';

export const convertBytes32ToString: ConvertFunctionWithError = (value) => {
  try {
    return { success: true, data: parseBytes32String(value) };
  } catch (error) {
    return {
      success: false,
      data: value,
      error: capitalizeFirstLetter(
        parseEthersErrorMessage((error as Error).message),
      ).trim(),
    };
  }
};
