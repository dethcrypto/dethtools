import React, { useState } from 'react';

import { ConversionInput } from '../src/components/ConversionInput';
import { CalculatorIcon } from '../src/components/icons/CalculatorIcon';
import { Tips } from '../src/components/Tips';
import { calculatorTips } from '../src/components/Tips/calculatorTips';
import { ToolContainer } from '../src/components/ToolContainer';
import { ToolHeader } from '../src/components/ToolHeader';
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
  eth: undefined,
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
    <ToolContainer>
      <form className="flex w-full flex-col items-start sm:mr-auto sm:items-center md:items-start">
        <ToolHeader
          icon={<CalculatorIcon width={19} height={19} />}
          text={['Calculators', 'Eth Unit Conversion']}
        />
        <section className="flex w-full flex-col gap-5">
          {UnitType.values.map((unit) => (
            <ConversionInput
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
        <Tips texts={calculatorTips} />
      </form>
    </ToolContainer>
  );
}
