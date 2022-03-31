export const unexpectedCall = (): never => {
  throw new Error('This function should not be called.');
};
