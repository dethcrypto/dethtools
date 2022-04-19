import { TypedTransaction } from '@ethereumjs/tx';
import { useState } from 'react';

import { DecodersIcon } from '../src/components/icons/DecodersIcon';
import { Button } from '../src/components/lib/Button';
import { ToolContainer } from '../src/components/ToolContainer';
import { ToolHeader } from '../src/components/ToolHeader';
import { DecodedTx, decodeTx } from '../src/lib/decodeTx';
import { toEvenHex } from '../src/lib/toEvenHex';

export default function TxDecoder() {
  const [error, setError] = useState<string>();

  const [rawTx, setRawTx] = useState<string>();
  const [decodeResults, setDecodeResults] =
    useState<{ tx: TypedTransaction; senderAddr: string }>();

  function handleDecodeCalldata() {
    setDecodeResults(undefined);
    let decoded: DecodedTx | undefined;
    try {
      if (rawTx) decoded = decodeTx(rawTx);
    } catch (e) {
      setError('Unable to decode transaction');
    }
    if (decoded) setDecodeResults(decoded);
  }

  const decodeButtonDisabled = !rawTx;

  return (
    <ToolContainer>
      <ToolHeader
        icon={<DecodersIcon height={24} width={24} />}
        text={['Decoders', 'Tx Decoder']}
      />

      <section>
        <label htmlFor="tx-input">raw transaction</label>

        <input
          id="tx-input"
          type="text"
          placeholder="e.g 0x0..."
          className="mb-2 mt-1 mr-auto h-10 w-full rounded-md border border-gray-600 bg-gray-900 text-sm focus:outline-none"
          onChange={(event) => setRawTx(toEvenHex(event.target.value))}
        />
      </section>

      <Button
        onClick={() => void handleDecodeCalldata()}
        className="mt-4"
        disabled={decodeButtonDisabled}
        title={decodeButtonDisabled ? 'Please fill in the tx field' : undefined}
      >
        Decode
      </Button>

      <section className="pt-8 pb-3">
        {decodeResults ? (
          rawTx ? (
            <p className="text-md pb-4 font-semibold">
              Possible decoded results:
            </p>
          ) : (
            'No results found'
          )
        ) : (
          <p> Decoded output will appear here </p>
        )}
      </section>

      <section
        className="xl relative overflow-auto rounded-md border border-gray-600 bg-gray-900 p-8"
        placeholder="Output"
      >
        {error ? (
          <p className="text-error">
            {error} with {rawTx}
          </p>
        ) : (
          <output>
            <pre className="items-left flex flex-col text-clip text-sm">
              <p>{JSON.stringify(decodeResults, null, 2)}</p>
            </pre>
          </output>
        )}
      </section>
    </ToolContainer>
  );
}
