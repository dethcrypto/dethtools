import { AssertionError } from 'assert';
import React, { ReactElement, useState } from 'react';

import { ConversionInput } from '../src/components/ConversionInput';
import { CurrentEpochTime } from '../src/components/CurrentEpochTime';
import { CalculatorIcon } from '../src/components/icons/CalculatorIcon';
import { Button } from '../src/components/lib/Button';
import { ToolContainer } from '../src/components/ToolContainer';
import { ToolHeader } from '../src/components/ToolHeader';
import {
  convertUnixEpochToUtc,
  UnixTimestampFormat,
} from '../src/lib/convertUnixEpochToUtc';
import { UtcUnit, UtcUnits, utcUnits } from '../src/lib/convertUtcProperties';
import { convertUtcToUnixEpoch } from '../src/lib/convertUtcToUnixEpoch';
import { unixEpochSchema } from '../src/misc/schemas/unixEpochSchema';
import { utcUnitToZodSchema } from '../src/misc/schemas/utcSchemas';
import { stringToNumber } from '../src/misc/stringToNumber';
import { toDefaultValues } from '../src/misc/toDefaultValues';
import { WithErrorAndResult } from '../src/misc/types';

export interface UtcConversionInputProps
  extends React.ComponentPropsWithoutRef<'input'> {
  utcError?: string;
}

export default function UnixEpochUtcConversion(): ReactElement {
  const [unixEpoch, setUnixEpoch] = useState<
    WithErrorAndResult<
      string,
      { utcDate: string; unixTimestampFormat: UnixTimestampFormat }
    >
  >({ inner: '' });
  const [utc, setUtc] = useState<WithErrorAndResult<UtcUnits, string>>({
    inner: toDefaultValues(utcUnits, '') as unknown as UtcUnits,
  });

  function handleChangeUnixEpoch(newValue: string): void {
    const parsed = unixEpochSchema.safeParse(newValue);
    if (!parsed.success) {
      setUnixEpoch({
        ...unixEpoch,
        inner: newValue,
        error: parsed.error.errors[0].message,
        result: undefined,
      });
    } else {
      setUnixEpoch({ inner: newValue });
    }
  }

  function handleConvertUnixEpoch(): void {
    if (unixEpoch.inner && !unixEpoch.error) {
      let result: ReturnType<typeof convertUnixEpochToUtc>;
      try {
        result = convertUnixEpochToUtc(unixEpoch.inner);
      } catch (error) {
        if (error instanceof AssertionError) {
          setUnixEpoch({
            ...unixEpoch,
            error: error.message,
            result: undefined,
          });
        }
      }
      if (result) {
        setUnixEpoch({
          ...unixEpoch,
          result,
        });
      }
    }
  }

  function handleChangeUtc(newValue: string, unitName: UtcUnit): void {
    if (newValue !== '') {
      let parsedNewValue: number;
      try {
        parsedNewValue = stringToNumber(newValue);
      } catch (error) {
        if (error instanceof Error) {
          setUtc({
            inner: {
              ...utc.inner,
              [unitName]: newValue,
            },
            result: undefined,
            error: error.message,
          });
        }
        // return early to assure that only correct `parsedNewValue` passes
        return;
      }
      const parsed = utcUnitToZodSchema[unitName].safeParse(parsedNewValue);
      if (!parsed.success) {
        setUtc({
          ...utc,
          inner: {
            ...utc.inner,
            [unitName]: newValue,
          },
          result: undefined,
          error: parsed.error.errors[0].message,
        });
      } else {
        newValue = String(parsed.data);
        setUtc({
          ...utc,
          inner: {
            ...utc.inner,
            [unitName]: newValue,
          },
          error: undefined,
        });
      }
    } else {
      setUtc({ inner: { ...utc.inner, [unitName]: newValue } });
    }
  }

  function handleConvertUTC(): void {
    const noEmptyFields = Object.values(utc.inner).every((value) => !!value);
    if (noEmptyFields && !utc.error) {
      const date = convertUtcToUnixEpoch(utc.inner);
      if (!isNaN(date)) {
        const unixEpoch = String(date);
        setUtc({ ...utc, result: unixEpoch });
      } else {
        setUtc({ ...utc, error: 'Invalid date', result: undefined });
      }
    } else {
      setUtc({
        ...utc,
        error: 'Please fill in all fields and/or correct errors',
      });
    }
  }

  return (
    <ToolContainer>
      <ToolHeader
        icon={<CalculatorIcon height={24} width={24} />}
        text={['Calculators', 'Unix Epoch - UTC Conversion']}
      />
      <section className="w-full rounded-md border border-gray-600 bg-gray-900 p-3.75 text-lg text-white">
        <h3 className="mb-1 text-xl font-bold text-gray-200">
          Current Unix Epoch Time
        </h3>
        <CurrentEpochTime />
      </section>
      <div className="my-8 w-full border border-b border-dotted border-gray-600" />
      <>
        <h3 className="mb-1 text-xl font-bold text-gray-200">
          Convert Unix Epoch to UTC
        </h3>
        <div className="flex items-center gap-3">
          <ConversionInput
            name="UnixEpoch"
            value={unixEpoch.inner || ''}
            onChange={(event) => handleChangeUnixEpoch(event.target.value)}
          />
          <Button
            aria-label="convert unix epoch"
            onClick={handleConvertUnixEpoch}
            className="mt-2"
          >
            Convert
          </Button>
        </div>
        <p role="alert" aria-atomic="true" className="text-error">
          {unixEpoch.inner && unixEpoch.error}
        </p>
        {unixEpoch.inner && (
          <div>
            {unixEpoch.result && (
              <section
                className="relative mb-2 rounded-md border border-gray-600 bg-gray-900 p-8"
                placeholder="Output"
              >
                <div className="flex gap-2 text-lg">
                  <p>Assumed unix timestamp format:</p>
                  <p aria-label="assumed format" className="font-bold">
                    {unixEpoch.result.unixTimestampFormat}
                  </p>
                </div>
                <p aria-label="utc date" className="text-lg">
                  {unixEpoch.result.utcDate}
                </p>
              </section>
            )}
          </div>
        )}
      </>
      <div className="my-8 w-full border border-b border-dotted border-gray-600" />{' '}
      <h3 className="mb-1 text-xl font-bold text-gray-200">
        Convert UTC to Unix Epoch
      </h3>
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          <UtcConversionInputs
            utc={utc}
            names={utcUnits}
            handleChangeUtc={handleChangeUtc}
          />
        </div>
        <Button
          aria-label="convert utc"
          onClick={handleConvertUTC}
          className="mt-2"
        >
          Convert
        </Button>
      </div>
      <p role="alert" aria-atomic="true" className="text-error">
        {utc.error}
      </p>
      <div>
        {utc.result && (
          <section
            className="relative mb-2 rounded-md border border-gray-600 bg-gray-900 p-8"
            placeholder="Output"
          >
            <div className="flex gap-2 text-lg">
              <p>Unix epoch </p>
              <p className="font-semibold">(in miliseconds): </p>
              <p aria-label="unix epoch" className="font-bold">
                {utc.result}
              </p>
            </div>
          </section>
        )}
      </div>
    </ToolContainer>
  );
}

interface UtcConversionInputProperties {
  utc: WithErrorAndResult<
    UtcUnits,
    { utcDate: string; unixTimestampFormat: UnixTimestampFormat } | string
  >;
  name: UtcUnit;
  handleChangeUtc: (newValue: string, timeUnit: UtcUnit) => void;
}

function UtcConversionInput({
  utc,
  name,
  handleChangeUtc,
}: UtcConversionInputProperties): ReactElement {
  return (
    <ConversionInput
      name={name}
      className="w-20 pr-4"
      value={utc.inner[name] || ''}
      onChange={(e) => handleChangeUtc(e.target.value, name)}
    />
  );
}

interface UtcConversionInputsProperties
  extends Omit<UtcConversionInputProperties, 'name'> {
  names: readonly UtcUnit[];
}

function UtcConversionInputs({
  names,
  utc,
  handleChangeUtc,
}: UtcConversionInputsProperties): ReactElement {
  return (
    <>
      {names.map((timeUnitName) => {
        return (
          <UtcConversionInput
            utc={utc}
            key={timeUnitName}
            name={timeUnitName}
            handleChangeUtc={handleChangeUtc}
          />
        );
      })}
    </>
  );
}
