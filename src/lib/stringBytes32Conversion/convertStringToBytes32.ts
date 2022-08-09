import { formatBytes32String } from '@ethersproject/strings';

import { parseEthersErrorMessage } from '../../../src/misc/parseEthersErrorMessage';
import { capitalizeFirstLetter } from '../capitalizeFirstLetter';
import { ConvertFunctionWithError } from './types';

export const convertStringToBytes32: ConvertFunctionWithError = (value) => {
  try {
    return { success: true, data: formatBytes32String(value) };
  } catch (error) {
    return {
      success: false,
      data: value,
      error: capitalizeFirstLetter(
        parseEthersErrorMessage((error as Error).message),
      ),
    };
  }
};
