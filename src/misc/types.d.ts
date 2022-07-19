export type WithOkAndErrorMsg<T> =
  | {
      inner: T;
      isOk: true;
    }
  | {
      isOk: false;
      errorMsg?: string;
    };

export type WithOkAndErrorMsgOptional<T> =
  | (Omit<WithOkAndErrorMsg<T>, 'inner'> & {
      isOk: true;
      inner?: T;
    })
  | {
      isOk: false;
      errorMsg?: string;
    };

export type WithErrorAndResult<T, R> = { inner: T; error?: string; result?: R };

export type WithError<T> = { value: T; error?: string };
