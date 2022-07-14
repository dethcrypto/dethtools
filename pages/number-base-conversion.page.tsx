import { ReactElement, useState } from 'react';
import { convertNumberBase } from '../src/lib/convertNumberBase';

import {
  NumberBase,
  NumberBaseType,
} from '../src/lib/numberBaseConvertProperties';

import { ConversionInput } from '../src/components/ConversionInput';
import { CalculatorIcon } from '../src/components/icons/CalculatorIcon';
import { ToolContainer } from '../src/components/ToolContainer';
import { ToolHeader } from '../src/components/ToolHeader';
import { WithError } from '../src/misc/types';
import { unitSchema } from '../src/misc/schemas/unitSchema';
import { binarySchema } from '../src/misc/schemas/binarySchema';
import { SafeParseError, SafeParseReturnType } from 'zod';
import { octalSchema } from '../src/misc/schemas/octalSchema';
import { hexSchema } from '../src/misc/schemas/hexSchema';
import { zodResultMessage } from '../src/misc/zodResultMessage';

interface NumberBaseConversionState
  extends Record<NumberBaseType, WithError<string>> {}

const initialState: NumberBaseConversionState = {
  binary: { value: '' },
  octal: { value: '' },
  decimal: { value: '' },
  hexadecimal: { value: '' },
};

export default function NumberBaseConversion(): ReactElement {
  const [state, setState] = useState<NumberBaseConversionState>(initialState);

  function handleChangeValue(newValue: string, currentType: NumberBaseType) {
    let parseResult: SafeParseReturnType<string, string> | undefined;
    switch (currentType) {
      case 'binary':
        parseResult = binarySchema.safeParse(newValue);
        break;
      case 'octal':
        parseResult = octalSchema.safeParse(newValue);
        break;
      case 'decimal':
        parseResult = unitSchema.safeParse(newValue);
        break;
      case 'hexadecimal':
        parseResult = hexSchema.safeParse(newValue);
        break;
      default:
        // this won't happen
        break;
    }
    if (parseResult && !parseResult.success) {
      setState((state) => ({
        ...state,
        [currentType]: {
          value: newValue,
          error: zodResultMessage(parseResult as SafeParseError<unknown>),
        },
      }));
      // return here to not override error set above
      return;
    }
    setState((oldState) => {
      const newState: NumberBaseConversionState = {
        ...oldState,
        [currentType]: { value: newValue },
      };
      return newState;
    });
    setState((oldState) => {
      const newState = { ...oldState };
      for (const unit of NumberBase) {
        if (unit === currentType) {
          newState[unit] = { value: newValue };
        } else {
          const convertedValue = convertNumberBase(newValue, currentType, unit);
          if (convertedValue && !isNaN(parseInt(convertedValue))) {
            newState[unit] = { value: convertedValue };
          }
        }
      }
      return newState;
    });
  }

  return (
    <ToolContainer>
      <form className="mr-auto flex w-full flex-col items-start sm:items-center md:items-start">
        <ToolHeader
          icon={<CalculatorIcon height={24} width={24} />}
          text={['Calculators', 'Number Base Conversion']}
        />
        <section className="flex w-full flex-col gap-5">
          <ConversionInputs
            handleChangeValue={handleChangeValue}
            state={state}
          />
        </section>
      </form>
    </ToolContainer>
  );
}
interface ConversionInputsProps {
  state: NumberBaseConversionState;
  handleChangeValue: (newValue: string, currentType: NumberBaseType) => void;
}

function ConversionInputs({
  state,
  handleChangeValue,
}: ConversionInputsProps): JSX.Element {
  return (
    <>
      <ConversionInput
        name="Binary"
        {...state['binary']}
        onChange={(e) => handleChangeValue(e.target.value, 'binary')}
      />
      <ConversionInput
        name="Octal"
        {...state['octal']}
        onChange={(e) => handleChangeValue(e.target.value, 'octal')}
      />
      <ConversionInput
        name="Decimal"
        {...state['decimal']}
        onChange={(e) => handleChangeValue(e.target.value, 'decimal')}
      />
      <ConversionInput
        name="Hexadecimal"
        {...state['hexadecimal']}
        onChange={(e) => handleChangeValue(e.target.value, 'hexadecimal')}
      />
    </>
  );
}
