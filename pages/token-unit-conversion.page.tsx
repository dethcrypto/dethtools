import Img from 'next/image';
import {
  ChangeEvent,
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ToolLayout } from '../src/layout/ToolLayout';
import { tokenPrecision } from '../src/lib/convertProperties';
import { convertTokenUnits } from '../src/lib/convertUnits';
import { decodeHex } from '../src/lib/decodeHex';
import { decimalSchema } from '../src/misc/decimalSchema';
import { unitSchema } from '../src/misc/unitSchema';

const DEFAULT_DECIMAL = '18';
type State = { base: string; unit: string };

const entries = Object.entries as <T>(obj: T) => [keyof T, T[keyof T]][];

export default function TokenUnitConversion() {
  const [error, setError] = useState<string>();

  const lastUpdate = useRef<UnitTypeExtended>();

  const [decimal, setDecimal] = useState('');
  const [state, setState] = useState<State>({ base: '', unit: '' });

  const handleChangeValue = useMemo(() => {
    return (value: string, currentType: TokenUnitType) => {
      value = decodeHex(value);

      setError(undefined);
      try {
        unitSchema.parse(value);
        decimalSchema.parse(decimal || DEFAULT_DECIMAL);
      } catch (e) {
        setError(JSON.parse(e as string)[0].message);
      }

      setState((oldState) => {
        const newState: State = { ...oldState, [currentType]: value };

        for (const [name, unitValue] of entries(newState)) {
          tokenPrecision.base = parseInt(decimal || DEFAULT_DECIMAL);
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
  }, [decimal, error]);

  useEffect(() => {
    if (lastUpdate.current) {
      handleChangeValue(lastUpdate.current.value, lastUpdate.current.name);
    }
  }, [handleChangeValue]);

  const units: UnitTypeExtended[] = [
    { name: 'unit', value: state.unit },
    { name: 'base', value: state.base },
  ];

  return (
    <ToolLayout>
      <form className="mx-auto flex flex-col items-start sm:items-center md:items-start">
        <header className="flex items-center gap-3 align-middle">
          <Img
            src="/static/svg/calculator.svg"
            width={32}
            height={32}
            alt="deth tools logo"
          />
          <h3 className="text-sm text-deth-gray-300 sm:text-xl">
            {' '}
            Calculators ﹥{' '}
          </h3>
          <h3 className="text-sm text-deth-pink sm:text-xl">
            {' '}
            Token unit conversion{' '}
          </h3>
        </header>
        <UnitElements
          units={units}
          error={error}
          onChange={handleChangeValue}
          setDecimal={setDecimal}
        />
      </form>
    </ToolLayout>
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

              <input
                id={name}
                placeholder={value ? value.toString() : '0'}
                value={value}
                type="string"
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
