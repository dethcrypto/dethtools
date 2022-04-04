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
import { tokenPrecision } from '../src/lib/convertProperties';
import { convertTokenUnits } from '../src/lib/convertUnits';
import { decodeHex } from '../src/lib/decodeHex';
import { unitSchema } from '../src/misc/unitSchema';

const DEFAULT_DECIMALS = 18;
type State = { base: string; unit: string };

const entries = Object.entries as <T>(obj: T) => [keyof T, T[keyof T]][];

export default function TokenUnitConversion() {
  const [error, setError] = useState<string>();

  const lastUpdate = useRef<UnitTypeExtended>();

  const [decimals, setDecimals] = useState(DEFAULT_DECIMALS);
  const [state, setState] = useState<State>({ base: '', unit: '' });

  const handleChangeValue = useMemo(() => {
    return (value: string, currentType: TokenUnitType) => {
      value = decodeHex(value);

      setError(undefined);
      try {
        unitSchema.parse(value);
      } catch (e) {
        setError(JSON.parse(e as string)[0].message);
      }

      setState((oldState) => {
        const newState: State = { ...oldState, [currentType]: value };

        for (const [name, unitValue] of entries(newState)) {
          // todo: fixme
          tokenPrecision.base = decimals;

          if (name === currentType) continue;

          let out: string = '';
          if (!error) {
            out = convertTokenUnits(value, currentType, name)!;
          }
          if (isNaN(parseInt(out))) out = unitValue;
          newState[name] = out;
        }
        lastUpdate.current = { name: currentType, value };
        return newState;
      });
    };
  }, [decimals, error]);

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
            value={state['unit']}
            error=""
            onChange={(e) => handleChangeValue(e.target.value, 'unit')}
          />
          <ConversionInput
            name="Base"
            value={state['base']}
            error=""
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
            placeholder={tokenPrecision.base.toString()}
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

type TokenUnitType = 'base' | 'unit';

interface UnitTypeExtended {
  name: TokenUnitType;
  value: string;
}
