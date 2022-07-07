// Parses ethers error which gives short error description before details
// in the ...x(...y) format. We want to pick x part only.
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
