export type WithOkAndErrorMsg<T> = {
  inner: T;
  isOk?: boolean;
  errorMsg?: string;
};

export type WithOkAndErrorMsgOptional<T> = Omit<
  WithOkAndErrorMsg<T>,
  'inner'
> & {
  inner?: T;
};
