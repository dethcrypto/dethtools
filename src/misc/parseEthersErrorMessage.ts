export function parseEthersErrorMessage(errorMsg: string): string {
  let error: string = '';
  for (const word of errorMsg) {
    if (word.includes('(')) {
      break;
    } else {
      error += word;
    }
  }
  return error;
}
