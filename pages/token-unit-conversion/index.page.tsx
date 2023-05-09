import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';

import { CopyableConversionInput } from '../../src/components/CopyableConversionInput';
import { CalculatorIcon } from '../../src/components/icons/CalculatorIcon';
import { CurrencyIcon } from '../../src/components/icons/Currency';
import { InputWithPredefinedValues } from '../../src/components/InputWithPredefinedValues';
import { Entity } from '../../src/components/lib/Entity';
import { Header } from '../../src/components/lib/Header';
import { ToolContainer } from '../../src/components/ToolContainer';
import { convertUnit } from '../../src/lib/convertUnits';
import { decodeHex } from '../../src/lib/decodeHex';
import { WithError } from '../../src/misc/types';
import { unitSchema } from '../../src/misc/validation/schemas/unitSchema';

const DEFAULT_DECIMALS = 18;

const predefinedDecimals = new Set([
  { label: 'gwei', value: 15 },
  { label: 'wad', value: 18 },
  { label: 'ray', value: 27 },
  { label: 'rad', value: 45 },
]);

type TokenUnitType = 'base' | 'unit';

interface UnitTypeExtended {
  name: TokenUnitType;
  value: string;
}

interface TokenUnitConversionState
  extends Record<TokenUnitType, WithError<string>> {}

const initialState: TokenUnitConversionState = {
  base: { value: '' },
  unit: { value: '' },
};

export default function TokenUnitConversion(): ReactElement {
  const lastUpdate = useRef<UnitTypeExtended>();

  const [decimals, setDecimals] = useState<WithError<number>>({
    value: DEFAULT_DECIMALS,
  });
  const [state, setState] = useState<TokenUnitConversionState>(initialState);

  const handleChangeValue = useMemo(() => {
    return (newValue: string, currentType: TokenUnitType) => {
      try {
        newValue = decodeHex(newValue);
      } catch (_) {
        setState((prevState) => ({
          ...prevState,
          [currentType]: {
            value: 0,
            error: 'The pasted hex value format was wrong',
          },
        }));
        // return here to not override error set above
        return;
      }

      const parsed = unitSchema.safeParse(newValue);

      if (!parsed.success) {
        setState((state) => ({
          ...state,
          [currentType]: {
            value: newValue,
            error: parsed.error.errors[0].message,
          },
        }));
        return;
      }

      newValue = parsed.data;

      setState((state) => {
        const newState: TokenUnitConversionState = {
          ...state,
          [currentType]: { value: newValue },
        };
        if (decimals.error) return newState;
        const otherUnit = currentType === 'base' ? 'unit' : 'base';
        const out = convertUnit(newValue, currentType, otherUnit, {
          unit: 1,
          base: decimals.value + 1,
        });
        if (out !== undefined && !isNaN(parseInt(out)))
          newState[otherUnit] = { value: out };
        lastUpdate.current = { name: currentType, value: newValue };
        return newState;
      });
    };
  }, [decimals]);

  // When decimals change, we update the last changed input and preserve
  // the oldest changed input.
  useEffect(() => {
    if (lastUpdate.current) {
      handleChangeValue(lastUpdate.current.value, lastUpdate.current.name);
    }
  }, [handleChangeValue]);

  return (
    <ToolContainer>
      <form className="mr-auto flex w-full flex-col items-start sm:items-center md:items-start">
        <Header
          icon={<CalculatorIcon height={24} width={24} />}
          text={['Calculators', 'Token Unit Conversion']}
        />

        <Entity title="conversion inputs" titleClassName="mb-6">
          <section className="flex w-full flex-col gap-5">
            <InputWithPredefinedValues
              name="Decimals"
              predefinedValues={predefinedDecimals}
              icon={<CurrencyIcon height={18} width={18} color="black" />}
              useExternalState={[decimals, setDecimals]}
              onChange={(event) => {
                const { validationMessage, valueAsNumber } =
                  event.target as HTMLInputElement;

                let error = validationMessage;

                if (isNaN(valueAsNumber) || valueAsNumber < 0) {
                  error = 'The decimals must be a number greater than 0';
                }
                setDecimals({ value: valueAsNumber, error });
              }}
            />

            <ConversionInputs
              handleChangeValue={handleChangeValue}
              state={state}
            />
          </section>
        </Entity>
      </form>
    </ToolContainer>
  );
}

interface ConversionInputsProps {
  state: TokenUnitConversionState;
  handleChangeValue: (newValue: string, currentType: TokenUnitType) => void;
}

function ConversionInputs({
  state,
  handleChangeValue,
}: ConversionInputsProps): JSX.Element {
  return (
    <>
      <CopyableConversionInput
        name="Units"
        {...state['unit']}
        onChange={(e) => handleChangeValue(e.target.value, 'unit')}
      />
      <CopyableConversionInput
        name="Base"
        {...state['base']}
        onChange={(e) => handleChangeValue(e.target.value, 'base')}
      />
    </>
  );
}
