import React, { ReactElement, useState } from 'react';

import { CopyableConversionInput } from '../../src/components/CopyableConversionInput';
import { CalculatorIcon } from '../../src/components/icons/CalculatorIcon';
import { ToolContainer } from '../../src/components/ToolContainer';
import { ToolHeader } from '../../src/components/ToolHeader';
import { UnitType, unitType } from '../../src/lib/convertProperties';
import { convertEthUnits } from '../../src/lib/convertUnits';
import { decodeHex } from '../../src/lib/decodeHex';
import { unitSchema } from '../../src/misc/validation/schemas/unitSchema';

type EthUnitConversionState = Record<
  UnitType,
  { value: string; error?: string }
>;

const powers = {
  wei: -18,
  gwei: -9,
  eth: undefined,
};

const initialState: EthUnitConversionState = {
  wei: { value: '' },
  gwei: { value: '' },
  eth: { value: '' },
};

export default function EthUnitConversion(): ReactElement {
  const [state, setState] = useState<EthUnitConversionState>(initialState);

  function handleChangeValue(newValue: string, currentType: UnitType): void {
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

    setState((state) => {
      const newState = { ...state };

      for (const unit of unitType.values) {
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
    <ToolContainer>
      <form className="flex w-full flex-col items-start sm:mr-auto sm:items-center md:items-start">
        <ToolHeader
          icon={<CalculatorIcon height={24} width={24} />}
          text={['Calculators', 'Eth Unit Conversion']}
        />
        <section className="flex w-full flex-col gap-5">
          {unitType.values.map((unit) => (
            <CopyableConversionInput
              key={unit}
              name={unit.toUpperCase()}
              {...state[unit]}
              onChange={(event) => handleChangeValue(event.target.value, unit)}
              extraLabel={
                powers[unit] && (
                  <span className="inline-block text-sm leading-none text-gray-300">
                    10
                    <sup className="-top-0.5">{powers[unit]}</sup>
                  </span>
                )
              }
            />
          ))}
        </section>
      </form>
    </ToolContainer>
  );
}
