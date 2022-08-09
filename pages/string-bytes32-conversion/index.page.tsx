import React, { ReactElement, useState } from 'react';

import { CopyableConversionInput } from '../../src/components/CopyableConversionInput';
import { CalculatorIcon } from '../../src/components/icons/CalculatorIcon';
import { Header } from '../../src/components/lib/Header';
import { ToolContainer } from '../../src/components/ToolContainer';
import { convertBytes32ToString } from '../../src/lib/stringBytes32Conversion/convertBytes32ToString';
import { convertStringToBytes32 } from '../../src/lib/stringBytes32Conversion/convertStringToBytes32';
import { handleChangeValidated } from '../../src/misc/handleChangeValidated';
import { WithError } from '../../src/misc/types';
import { hexValidator } from '../../src/misc/validation/validators/hexValidator';
import { stringValidator } from '../../src/misc/validation/validators/stringValiator';

export default function StringBytes32Conversion(): ReactElement {
  const [bytes32, setBytes32] = useState<WithError<string>>({ value: '' });
  const [string, setString] = useState<WithError<string>>({ value: '' });

  const flushString = (): void => setString({ value: '', error: undefined });
  const flushBytes32 = (): void => setBytes32({ value: '', error: undefined });
  const flushBoth = (): void => {
    flushString();
    flushBytes32();
  };

  const handleChangeString = (newValue: string): void => {
    handleChangeValidated({
      newValue,
      setState: setString,
      flushFn: flushBytes32,
      validateFn: (newValue) => stringValidator(newValue),
    });
    const result = convertStringToBytes32(newValue);

    if (result.success) setBytes32({ value: result.data, error: undefined });
    else setString({ value: result.data, error: result.error });

    // flush other filed if current one is empty
    if (newValue.length === 0) setBytes32({ value: '', error: undefined });
  };

  const handleChangeBytes32 = (newValue: string): void => {
    handleChangeValidated({
      newValue,
      setState: setBytes32,
      flushFn: flushString,
      validateFn: (newValue) => hexValidator(newValue),
    });
    const result = convertBytes32ToString(newValue);

    if (result.success) setString({ value: result.data, error: undefined });
    else setBytes32({ value: result.data, error: result.error });

    // todo - in future this could be included in the handleChangeValidated if such pattern occurs often enough
    // flush other filed if current one is empty
    if (newValue.length === 0) flushBoth();
  };

  return (
    <ToolContainer>
      <form className="flex w-full flex-col items-start sm:mr-auto sm:items-center md:items-start">
        <Header
          icon={<CalculatorIcon height={24} width={24} />}
          text={['Calculators', 'String-Bytes32 Conversion']}
        />
        <section className="flex w-full flex-col gap-5">
          <CopyableConversionInput
            key="string"
            name="String"
            value={string.value}
            error={string.error}
            placeholder="Enter a string"
            onChange={({ target }) => handleChangeString(target.value)}
          />
          <CopyableConversionInput
            key="bytes32"
            name="Bytes32"
            value={bytes32.value}
            error={bytes32.error}
            placeholder="Enter a hexadecimal value"
            onChange={({ target }) => handleChangeBytes32(target.value)}
          />
        </section>
      </form>
    </ToolContainer>
  );
}
