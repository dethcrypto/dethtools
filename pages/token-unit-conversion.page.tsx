import {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ConversionInput } from '../src/components/ConversionInput';
import { CalculatorIcon } from '../src/components/icons/CalculatorIcon';
import { CurrencyIcon } from '../src/components/icons/Currency';
import { ToolContainer } from '../src/components/ToolContainer';
import { ToolHeader } from '../src/components/ToolHeader';
import { convertUnit } from '../src/lib/convertUnits';
import { decodeHex } from '../src/lib/decodeHex';
import { unitSchema } from '../src/misc/schemas/unitSchema';
import { WithError } from '../src/misc/types';

const DEFAULT_DECIMALS = 18;

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
        <ToolHeader
          icon={<CalculatorIcon height={24} width={24} />}
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

interface PredefinedDecimal {
  name: string;
  value: number;
}

const predefinedDecimals: PredefinedDecimal[] = [
  { name: 'gwei', value: 15 },
  { name: 'wad', value: 18 },
  { name: 'ray', value: 27 },
  { name: 'rad', value: 45 },
];

function DecimalsInput({
  decimals,
  setDecimals,
}: DecimalsInputProps): ReactElement {
  const [showPredefined, setShowPredefined] = useState(false);
  return (
    <div className="relative">
      <ConversionInput
        className="w-full pr-10"
        name="Decimals"
        value={decimals.value}
        error={decimals.error}
        type="number"
        onChange={(e) => {
          const value = e.target.valueAsNumber;
          setDecimals({ value });
        }}
      />
      <div
        aria-label="predefined decimals button"
        className="absolute top-10 right-4 cursor-pointer duration-200 hover:scale-105 active:scale-90"
        onClick={() => setShowPredefined(!showPredefined)}
      >
        <CurrencyIcon width={18} height={18} color="#0000000" />
      </div>
      <section
        aria-label="predefined decimals dropdown"
        className={`absolute w-full rounded-md border border-gray-600 bg-gray-800 px-4 py-2 shadow-md ${
          showPredefined ? 'opacity-1 block select-none' : 'hidden opacity-0'
        }`}
      >
        {predefinedDecimals.map((decimal) => {
          return (
            <div
              aria-label={`${decimal.name} predefined decimal`}
              key={decimal.name}
              onClick={() => {
                setDecimals({ value: decimal.value });
                setShowPredefined(!showPredefined);
              }}
              className="flex cursor-pointer rounded-md p-1 duration-200 
                       hover:bg-gray-600 active:scale-95"
            >
              <p aria-label="predefined decimal name">{decimal.name}</p>
              <sup
                aria-label="predefined decimal value"
                className="inline-block text-sm leading-none text-gray-300"
              >
                {decimal.value}
              </sup>
            </div>
          );
        })}
      </section>
    </div>
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
