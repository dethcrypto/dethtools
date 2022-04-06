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

  return (
    <ToolContainer>
      <ToolHeader icon={<DecodersIcon />} text={['Decoders', 'Tx Decoder']} />

      <section className="pt-10">
        <label className="pb-2" htmlFor="tx-input">
          raw transaction
        </label>

        <input
          id="tx-input"
          type="text"
          placeholder="e.g 0x0..."
          className="mb-2 mr-auto h-10 w-full rounded-md border border-gray-600 bg-gray-900 text-sm focus:outline-none"
          onChange={(event) => setRawTx(toEvenHex(event.target.value))}
        />
      </section>

      <Button
        onClick={() => void handleDecodeCalldata()}
        title={'Please fill in the calldata'}
      >
        Decode
      </Button>

      <section className="pt-4">
        {!decodeResults && <p> Decoded output will appear here </p>}
      </section>

      <section
        className="relative mb-16 max-w-xl rounded-md border border-gray-600 bg-gray-900 p-8"
        placeholder="Output"
      >
        {error ? (
          <p className="text-error">
            {error} with {rawTx} value
          </p>
        ) : (
          <output>
            <p>{decodeResults && 'decode results:'}</p>
            <pre className="items-left flex flex-col text-clip font-semibold">
              <code>{JSON.stringify(decodeResults, null, 2)}</code>
            </pre>
          </output>
        )}
      </section>
    </ToolContainer>
  );
}
