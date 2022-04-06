import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ConversionInput } from '../src/components/ConversionInput';
import { CalculatorIcon } from '../src/components/icons/CalculatorIcon';
import { ToolContainer } from '../src/components/ToolContainer';
import { ToolHeader } from '../src/components/ToolHeader';
import { convertUnit } from '../src/lib/convertUnits';
import { decodeHex } from '../src/lib/decodeHex';
import { unitSchema } from '../src/misc/unitSchema';

const DEFAULT_DECIMALS = 18;

type TokenUnitType = 'base' | 'unit';

interface UnitTypeExtended {
  name: TokenUnitType;
  value: string;
}

type WithError<T> = { value: T; error?: string };

interface TokenUnitConversionState
  extends Record<TokenUnitType, WithError<string>> {}

const initialState: TokenUnitConversionState = {
  base: { value: '' },
  unit: { value: '' },
};

export default function TokenUnitConversion() {
  const lastUpdate = useRef<UnitTypeExtended>();

  const [decimals, setDecimals] = useState<WithError<number>>({
    value: DEFAULT_DECIMALS,
  });
  const [state, setState] = useState<TokenUnitConversionState>(initialState);

  const handleChangeValue = useMemo(() => {
    return (newValue: string, currentType: TokenUnitType) => {
      newValue = decodeHex(newValue);

      const parsed = unitSchema.safeParse(newValue);

      if (!parsed.success) {
        setState((prevState) => ({
          ...prevState,
          [currentType]: {
            value: newValue,
            error: parsed.error.errors[0].message,
          },
        }));

        return;
      }

      newValue = parsed.data;

      setState((oldState) => {
        const newState: TokenUnitConversionState = {
          ...oldState,
          [currentType]: { value: newValue },
        };

        if (decimals.error) return newState;

        const otherUnit = currentType === 'base' ? 'unit' : 'base';

        const out = convertUnit(newValue, currentType, otherUnit, {
          unit: 1,
          base: decimals.value + 1,
        });

        if (out !== undefined) newState[otherUnit] = { value: out };

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
        <ToolHeader
          icon={<CalculatorIcon />}
          text={['Calculators', 'Token Unit Conversion']}
        />
        <section className="flex w-full flex-col gap-5">
          <DecimalsInput decimals={decimals} setDecimals={setDecimals} />
          <ConversionInputs
            handleChangeValue={handleChangeValue}
            state={state}
          />
        </section>
      </form>
    </ToolContainer>
  );
}

interface DecimalsInputProps {
  decimals: WithError<number>;
  setDecimals: Dispatch<SetStateAction<WithError<number>>>;
}

function DecimalsInput({ decimals, setDecimals }: DecimalsInputProps) {
  return (
    <ConversionInput
      name="Decimals"
      value={decimals.value}
      error={decimals.error}
      type="number"
      min={0}
      max={26}
      onChange={(e) => {
        let error = e.target.validationMessage;

        const value = e.target.valueAsNumber;
        if (isNaN(value) || value < 0) {
          error = 'The decimals must be a number between 0 and 26';
        }

        setDecimals({ value, error });
      }}
    />
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
      <ConversionInput
        name="Units"
        {...state['unit']}
        onChange={(e) => handleChangeValue(e.target.value, 'unit')}
      />
      <ConversionInput
        name="Base"
        {...state['base']}
        onChange={(e) => handleChangeValue(e.target.value, 'base')}
      />
    </>
  );
}
