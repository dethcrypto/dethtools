import { SafeParseError } from 'zod';

export function zodResultMessage(parseResult: SafeParseError<unknown>): string {
  return (
    Object.entries(JSON.parse(parseResult.error.message))[0][1] as {
      [key: string]: string;
    }
  ).message;
}
