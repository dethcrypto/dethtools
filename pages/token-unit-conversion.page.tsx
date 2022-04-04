import {
  ChangeEvent,
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import CalculatorSvg from '../public/static/svg/calculator';
import { ConversionInput } from '../src/components/ConversionInput';
import { Input } from '../src/components/lib/Input';
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

interface TokenUnitConversionState
  extends Record<TokenUnitType, { value: string; error?: string }> {}

const initialState: TokenUnitConversionState = {
  base: { value: '' },
  unit: { value: '' },
};

export default function TokenUnitConversion() {
  const lastUpdate = useRef<UnitTypeExtended>();

  const [decimals, setDecimals] = useState(DEFAULT_DECIMALS);
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

        const otherUnit = currentType === 'base' ? 'unit' : 'base';

        const out = convertUnit(newValue, currentType, otherUnit, {
          unit: 1,
          base: (isNaN(decimals) ? 0 : decimals) + 1,
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
      <form className="mx-auto flex flex-col items-start sm:items-center md:items-start">
        <ToolHeader
          icon={<CalculatorSvg />}
          text={['Calculators', 'Token Unit Conversion']}
        />
        <section className="flex w-full flex-col gap-5">
          <ConversionInput
            name="Decimals"
            value={decimals}
            error=""
            type="number"
            min={0}
            max={26}
            onChange={(e) => setDecimals(e.target.valueAsNumber)}
          />
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
        </section>
      </form>
    </ToolContainer>
  );
}

interface UnitElementsProps {
  units: UnitTypeExtended[];
  error: string | undefined;
  onChange: (value: string, unitType: TokenUnitType) => void;
  setDecimal: (value: string) => void;
}

function UnitElements({
  units,
  error,
  onChange,
  setDecimal,
}: UnitElementsProps): JSX.Element {
  return (
    <Fragment>
      <p
        data-testid="error"
        className="absolute top-2/3 text-sm text-deth-error"
      >
        {error}
      </p>

      <div className="mt-5 w-full">
        <div className="flex flex-col">
          <div className="mb-2 py-1 text-left text-xs font-medium uppercase tracking-wider">
            <label htmlFor="decimals">decimals</label>
          </div>

          <input
            id="decimals"
            type="number"
            min={0}
            placeholder="0"
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setDecimal(event.target.value);
            }}
            className="rounded-md border border-deth-gray-600 bg-deth-gray-900 p-3 text-lg"
          />
        </div>
      </div>

      {units.map((unit) => {
        const { name, value } = unit;

        return (
          <div key={name} className="mt-5 w-full">
            <div className="flex flex-col">
              <div className="mb-2 py-1 text-left text-xs font-medium uppercase tracking-wider">
                <label htmlFor={name}>{name}</label>
              </div>

              <Input
                id={name}
                placeholder={value ? value.toString() : '0'}
                value={value}
                type="text"
                onChange={(event) => {
                  onChange(event.target.value, name);
                }}
                className="rounded-md border border-deth-gray-600 bg-deth-gray-900 p-3 text-lg"
              />
            </div>
          </div>
        );
      })}
    </Fragment>
  );
}
