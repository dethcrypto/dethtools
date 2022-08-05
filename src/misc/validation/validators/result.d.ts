export type ValidatorResult =
  | { success: true }
  | { success: false; error: string };
