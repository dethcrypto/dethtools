export type ConvertFunctionWithError = (
  value: string,
) =>
  | { success: true; data: string }
  | { success: false; data: string; error: string };
