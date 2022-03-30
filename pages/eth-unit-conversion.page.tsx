import { ChangeEvent, Fragment, useState } from 'react';

import CalculatorSvg from '../public/static/svg/calculator';
import { ToolLayout } from '../src/layout/ToolLayout';
import { UnitType } from '../src/lib/convertProperties';
import { convertEthUnits } from '../src/lib/convertUnits';
import { decodeHex } from '../src/lib/decodeHex';
import { unitSchema } from '../src/misc/unitSchema';

type State = { wei: string; gwei: string; eth: string };

export default function EthUnitConversion() {
  const [error, setError] = useState<string | undefined>();
  const [state, setState] = useState<State>({ wei: '', gwei: '', eth: '' });

  const units: UnitTypeExtended[] = [
    { name: 'wei', powFormat: '10-18', value: state.wei },
    { name: 'gwei', powFormat: '10-9', value: state.gwei },
    { name: 'eth', powFormat: '10-1', value: state.eth },
  ];

  function handleChangeValue(value: string, currentType: UnitType) {
    value = decodeHex(value);

    const result = unitSchema.safeParse(value);
    if (!result.success) {
      setError(result.error.errors[0].message);
    } else {
      value = result.data;
      setError(undefined);
    }

    setState((s) => ({ ...s, [currentType]: value }));

    for (const unit of units) {
      if (unit.name === currentType) continue;

      let out: string = '';
      if (parseFloat(value) >= 0) {
        out = convertEthUnits(value, currentType, unit.name)!;
      }
      if (isNaN(parseInt(out))) {
        out = unit.value;
      }

      setState((s) => ({ ...s, [unit.name]: out }));
    }
  }

  return (
    <ToolLayout>
      <form className="mx-auto flex flex-col items-start sm:items-center md:items-start">
        <header className="mb-6 flex items-center gap-3 align-middle">
          <CalculatorSvg
            width={32}
            height={32}
            alt="deth ethereum unit conversion calculator icon"
          />
          <h3 className="text-sm text-deth-gray-300 sm:text-xl">
            Calculators /
          </h3>
          <h3 className="text-sm text-deth-pink sm:text-xl">
            Eth unit conversion
          </h3>
        </header>
        <UnitElements
          onChange={handleChangeValue}
          units={units}
          error={error}
        />
      </form>
    </ToolLayout>
  );
}

interface UnitElementsProps {
  units: UnitTypeExtended[];
  error: string | undefined;
  onChange: (value: string, unitType: UnitType) => void;
}
function UnitElements({
  units,
  error,
  onChange,
}: UnitElementsProps): JSX.Element {
  return (
    <Fragment>
      <p
        data-testid="error"
        className="absolute top-2/3 text-sm text-deth-error"
      >
        {error}
      </p>

      {units.map((unit) => {
        const { name, value, powFormat } = unit;
        return (
          <div key={name} className="mt-5 w-full">
            <section className="flex flex-col">
              <div className="mb-2 flex gap-2 py-1 text-left text-xs font-medium uppercase tracking-wider">
                <label htmlFor={name}>{name}</label>
                <p className="text-deth-gray-300">
                  {powFormat.slice(0, 2)}
                  <sup>{powFormat.slice(2, 5)}</sup>
                </p>
              </div>

              <input
                id={name}
                placeholder={value ? value.toString() : '0'}
                value={value}
                type="string"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onChange(event.target.value, name);
                }}
                className="rounded-md border border-deth-gray-600 bg-deth-gray-900 p-3 text-lg"
              />
            </section>
          </div>
        );
      })}
    </Fragment>
  );
}

interface UnitTypeExtended {
  name: UnitType;
  powFormat: string;
  value: string;
}
