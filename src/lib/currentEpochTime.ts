// @internal
export const currentEpochTime = {
  get(): number {
    return Math.floor(new Date().getTime() / 1000);
  },
};
