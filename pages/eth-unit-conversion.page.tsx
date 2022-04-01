import { ChangeEvent, useState } from 'react';

import CalculatorSvg from '../public/static/svg/calculator';
import { Input } from '../src/components/lib/Input';
import { ToolLayout } from '../src/layout/ToolLayout';
import { UnitType } from '../src/lib/convertProperties';
import { convertEthUnits } from '../src/lib/convertUnits';
import { decodeHex } from '../src/lib/decodeHex';
import { unitSchema } from '../src/misc/unitSchema';

type EthUnitConversionState = Record<
  UnitType,
  { value: string; error?: string }
>;

const powers = {
  wei: -18,
  gwei: -9,
  eth: -1,
};

const initialState: EthUnitConversionState = {
  wei: { value: '' },
  gwei: { value: '' },
  eth: { value: '' },
};

export default function EthUnitConversion() {
  const [state, setState] = useState<EthUnitConversionState>(initialState);

  function handleChangeValue(newValue: string, currentType: UnitType) {
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
      const newState = { ...oldState };

      for (const unit of UnitType.values) {
        if (unit === currentType) newState[unit] = { value: newValue };
        else if (parseFloat(newValue) >= 0) {
          const out = convertEthUnits(newValue, currentType, unit)!;
          if (!isNaN(parseInt(out))) newState[unit] = { value: out };
        }
      }

      return newState;
    });
  }

  return (
    <ToolLayout>
      <form className="flex flex-col items-start sm:mx-4 sm:items-center  md:mx-16 md:items-start">
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
        <section className="flex w-full flex-col gap-5">
          {UnitType.values.map((unit) => (
            <ConversionInput
              key={unit}
              name={unit}
              {...state[unit]}
              onChange={handleChangeValue}
            />
          ))}
        </section>
      </form>
    </ToolLayout>
  );
}

interface ConversionInputProps {
  name: UnitType;
  value: string;
  error?: string;
  onChange: (newValue: string, unit: UnitType) => void;
}
function ConversionInput({
  name,
  value,
  error,
  onChange,
}: ConversionInputProps) {
  return (
    <label htmlFor={name} className="flex flex-col">
      <div className="mb-2 flex gap-2 py-1 text-left text-xs font-medium uppercase tracking-wider">
        <span>{name}</span>
        <p className="text-deth-gray-300">
          10<sup>{powers[name]}</sup>
        </p>
      </div>

      <Input
        id={name}
        type="text"
        placeholder={value ? value.toString() : '0'}
        value={value}
        error={error}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onChange(event.target.value, name);
        }}
      />
    </label>
  );
}
