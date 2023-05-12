import React, { ReactElement, useState } from 'react';

import { CopyableConversionInput } from '../../src/components/CopyableConversionInput';
import { CalculatorIcon } from '../../src/components/icons/CalculatorIcon';
import { Button } from '../../src/components/lib/Button';
import { Header } from '../../src/components/lib/Header';
import { NodeBlock } from '../../src/components/lib/NodeBlock';
import { ToolContainer } from '../../src/components/ToolContainer';
import { getContractAddress } from '../../src/lib/contractAddress';
import { handleChangeValidated } from '../../src/misc/handleChangeValidated';
import { WithError } from '../../src/misc/types';
import { addressValidator } from '../../src/misc/validation/validators/addressValidator';
import { numberValidator } from '../../src/misc/validation/validators/numberValidator';

export default function ContractAddressCalculator(): ReactElement {
  const [fromAddress, setFromAddress] = useState<WithError<string>>({
    value: '',
  });
  const [nonce, setNonce] = useState<WithError<string>>({
    value: '',
  });

  const [calculatedContractAddress, setCalculatedContractAddress] = useState<
    string | undefined
  >();

  function flushResults(): void {
    setCalculatedContractAddress(undefined);
  }

  function handleChangeFromAddress(newValue: string): void {
    handleChangeValidated({
      newValue,
      validateFn: (newValue) => addressValidator(newValue),
      setState: setFromAddress,
      flushFn: flushResults,
    });
  }

  function handleChangeNonce(newValue: string): void {
    handleChangeValidated({
      newValue,
      validateFn: (newValue) => numberValidator(newValue),
      setState: setNonce,
      flushFn: flushResults,
    });
  }

  function handleCalculateContractAddress(): void {
    try {
      setCalculatedContractAddress(
        getContractAddress({
          from: fromAddress.value,
          nonce: nonce.value,
        }),
      );
    } catch {
      flushResults();
    }
  }

  const calculateButtonIsDisabled = Boolean(
    !fromAddress.value || fromAddress.error || !nonce.value || nonce.error,
  );

  return (
    <ToolContainer>
      <form className="flex w-full flex-col items-start sm:mr-auto sm:items-center md:items-start">
        <Header
          icon={<CalculatorIcon height={24} width={24} />}
          text={['Calculators', 'Contract Address Calculator']}
        />
        <section className="flex w-full flex-col gap-5">
          <CopyableConversionInput
            name="From"
            value={fromAddress.value}
            error={fromAddress.error}
            placeholder="0x0.."
            onChange={(event) => handleChangeFromAddress(event.target.value)}
          />
          <CopyableConversionInput
            name="Nonce"
            value={nonce.value}
            error={nonce.error}
            onChange={(event) => handleChangeNonce(event.target.value)}
          />
        </section>
      </form>
      <Button
        title="Calculate"
        className="mt-6"
        disabled={calculateButtonIsDisabled}
        onClick={handleCalculateContractAddress}
      >
        Calculate
      </Button>
      {calculatedContractAddress && (
        <section className="mt-10 rounded-md border border-gray-600 bg-gray-900 p-8">
          <NodeBlock toggle={false} str={calculatedContractAddress}>
            Contract address:
          </NodeBlock>
        </section>
      )}
    </ToolContainer>
  );
}
