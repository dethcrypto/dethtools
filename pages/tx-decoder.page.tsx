import { TypedTransaction } from '@ethereumjs/tx';
import { ChangeEvent, useState } from 'react';

import DecoderSvg from '../public/static/svg/decoders';
import { Button } from '../src/components/Button';
import { ToolLayout } from '../src/layout/ToolLayout';
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
    <ToolLayout>
      <header className="flex items-center gap-3 align-middle">
        <DecoderSvg width={30} height={30} alt="deth calldata decoder icon" />
        <h3 className="text-sm text-deth-gray-300 sm:text-xl">Decoders /</h3>
        <h3 className="text-sm text-deth-pink sm:text-xl">Tx Decoder</h3>
      </header>

      <section className="pt-10">
        <label className="pb-2" htmlFor="tx-input">
          raw transaction
        </label>

        <input
          id="tx-input"
          type="text"
          placeholder="e.g 0x0..."
          className="mb-2 mr-auto h-10 w-full rounded-md border border-deth-gray-600 bg-deth-gray-900 text-sm focus:outline-none"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setRawTx(toEvenHex(event.target.value));
          }}
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
        className="relative mb-16 max-w-xl rounded-md border border-deth-gray-600 bg-deth-gray-900 p-8"
        placeholder="Output"
      >
        {error ? (
          <p className="text-deth-error">
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
    </ToolLayout>
  );
}
