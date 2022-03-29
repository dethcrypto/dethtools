import { ChangeEvent, Fragment, useState } from 'react';

import { UnitType } from '../lib/convertProperties';
import { convertEthUnits } from '../lib/convertUnits';
import { decodeHex } from '../lib/decodeHex';
import { unitSchema } from '../misc/unitSchema';

type State = { wei: string; gwei: string; eth: string };

export default function EthUnitConversion() {
  const [error, setError] = useState<string | undefined>();
  const [state, setState] = useState<State>({ wei: '', gwei: '', eth: '' });

  const units: UnitTypeExtended[] = [
    { name: 'wei', value: state.wei },
    { name: 'gwei', value: state.gwei },
    { name: 'eth', value: state.eth },
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
    <div className="max-w-1/3 ml-auto mt-32 flex w-4/5 pl-24">
      <form className="mx-auto flex flex-col gap-10">
        <h1> Ethereum unit conversion </h1>
        <UnitElements
          onChange={handleChangeValue}
          units={units}
          error={error}
        />
      </form>
    </div>
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
      <p data-testid="error" className="absolute mt-12 text-sm text-red-400">
        {error}
      </p>

      {units.map((unit) => {
        const { name, value } = unit;
        return (
          <div key={name}>
            <table className="min-w-full table-fixed divide-y divide-gray-200">
              <thead className="rounded-sm bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="py-1 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-400"
                  >
                    <label htmlFor={name} className="text-lg">
                      {name}
                    </label>
                  </th>

                  <th
                    scope="col"
                    className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-400"
                  >
                    <input
                      id={name}
                      placeholder={value ? value.toString() : '0'}
                      value={value}
                      type="string"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        onChange(event.target.value, name);
                      }}
                      className="w-72 rounded-sm border border-dashed border-black p-3 text-lg"
                    />
                  </th>
                </tr>
              </thead>
            </table>
          </div>
        );
      })}
    </Fragment>
  );
}

interface UnitTypeExtended {
  name: UnitType;
  value: string;
}
