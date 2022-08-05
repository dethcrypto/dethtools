// import { parseBytes32String } from '@ethersproject/strings';
// import { ReactElement, ReactNode, useState } from 'react';
// import { hexSchema } from 'src/misc/schemas/hexSchema';
// import { ZodError, ZodSchema } from 'zod';

// import { ConversionInput } from '../src/components/ConversionInput';
// import { CalculatorIcon } from '../src/components/icons/CalculatorIcon';
// import { Button } from '../src/components/lib/Button';
// import { ToolContainer } from '../src/components/ToolContainer';
// import { ToolHeader } from '../src/components/ToolHeader';
// import { WithErrorAndResult } from '../src/misc/types';

// interface AnyZodSchema extends ZodSchema<unknown, any, unknown> {}

// interface ValidateNewValue<T> {
//   newValue: string;
//   useState: [T, React.Dispatch<React.SetStateAction<T>>];
//   validatorOrZodSchema: AnyZodSchema;
// }

// function validateNewValue({
//   newValue,
//   useState,
//   validatorOrZodSchema,
// }: ValidateNewValue<WithErrorAndResult<string, string>>): void {
//   const [state, setState] = useState;
//   let parsed;
//   if (newValue === '') {
//     setState({ value: newValue });
//   } else {
//     try {
//       parsed = validatorOrZodSchema.parse(newValue) as string;
//       setState({ value: parsed, error: undefined });
//     } catch (error) {
//       if (error instanceof ZodError) {
//         setState({
//           value: newValue,
//           result: undefined,
//           error: JSON.parse(error.message)[0].message,
//         });
//       } else {
//         // todo: handle other errors
//       }
//     }
//   }
// }

// export default function Bytes32StringConversion(): ReactElement {
//   const [bytes32, setBytes32] = useState<WithErrorAndResult<string, string>>({
//     value: '',
//   });
//   const [string, setString] = useState<WithErrorAndResult<string, string>>({
//     value: '',
//   });

//   function handleChangeBytes32(newValue: string): void {
//     validateNewValue({
//       newValue,
//       useState: [bytes32, setBytes32],
//       validatorOrZodSchema: hexSchema,
//     });
//   }

//   function handleConvertBytes32(): void {
//     let result;
//     try {
//       result = parseBytes32String(bytes32.value);
//     } catch (error) {
//       console.log(error);
//     }
//     console.log(result);
//   }

//   function handleChangeString(newValue: string): void {
//     setString({ value: newValue });
//   }

//   function handleConvertString(): void {}

//   return (
//     <ToolContainer>
//       <form
//         className="mr-auto flex w-full flex-col items-start
//         sm:items-center md:items-start"
//       >
//         <ToolHeader
//           icon={<CalculatorIcon height={24} width={24} />}
//           text={['Calculators', 'Bytes32 - String Conversion']}
//         />
//         <section className="flex w-full flex-col gap-10">
//           <ConversionBlock
//             label="Convert bytes32 to string"
//             name="bytes32"
//             {...bytes32}
//             handleInputChange={handleChangeBytes32}
//             handleConvert={handleConvertBytes32}
//           />
//           <ConversionBlock
//             label="Convert string to bytes32"
//             name="string"
//             {...string}
//             handleInputChange={handleChangeString}
//             handleConvert={handleConvertString}
//           />
//         </section>
//       </form>
//     </ToolContainer>
//   );
// }

// interface ConversionBlockProps {
//   label: string;
//   name: string;
//   value: string;
//   error?: string;
//   result?: string;
//   handleInputChange: (newValue: string) => void;
//   handleConvert: () => void;
// }

// function ConversionBlock({
//   label,
//   name,
//   value,
//   error,
//   result,
//   handleConvert,
//   handleInputChange,
// }: ConversionBlockProps): ReactElement {
//   return (
//     <div>
//       <h3 className="text-xl font-bold text-gray-200">{label}</h3>
//       <div className="mb-8 flex items-center gap-3">
//         <ConversionInput
//           className="flex-1"
//           key={name}
//           name={name}
//           error={error}
//           value={value || ''}
//           onChange={(event) => handleInputChange(event.target.value)}
//         />
//         <Button
//           aria-label="convert unix epoch"
//           className="mt-4 flex-none"
//           onClick={(event) => {
//             event.preventDefault();
//             handleConvert();
//           }}
//         >
//           Convert
//         </Button>
//       </div>
//       {result && (
//         <ConversionResult>Assumed unix timestamp format:</ConversionResult>
//       )}
//     </div>
//   );
// }

// interface ConversionResultProps {
//   children: ReactNode;
// }

// function ConversionResult({ children }: ConversionResultProps): ReactElement {
//   console.log(children);
//   return (
//     <section
//       className="relative mb-2 rounded-md border border-gray-600 bg-gray-900 p-8"
//       placeholder="Output"
//     >
//       <div className="flex gap-2 text-lg">
//         <p>{children}</p>
//         <p aria-label="assumed format" className="font-bold">
//           {/* {unixEpoch.result.unixTimestampFormat} */}
//         </p>
//       </div>
//       <p aria-label="utc date" className="text-lg">
//         {/* {unixEpoch.result.utcDate} */}
//       </p>
//     </section>
//   );
// }

export {};
