import { Interface, ParamType } from '@ethersproject/abi';
import {
  ChangeEvent,
  ClipboardEvent,
  ReactElement,
  useMemo,
  useState,
} from 'react';

import { AbiSourceTabs } from '../../src/components/lib/AbiSourceTabs/AbiSourceTabs';
import { DecodedCalldataTree } from '../../src/components/DecodedCalldataTree';
import { DecodersIcon } from '../../src/components/icons/DecodersIcon';
import { Button } from '../../src/components/lib/Button';
import { Spinner } from '../../src/components/Spinner';
import { TextArea } from '../../src/components/lib/TextArea/TextArea';
import { ToolContainer } from '../../src/components/ToolContainer';
import { Header } from '../../src/components/lib/Header';
import {
  decodeWithCalldata,
  fetch4BytesBy,
  sigHashFromCalldata,
} from '../../src/lib/decodeBySigHash';
import { decodeCalldata, Decoded } from '../../src/lib/decodeCalldata';
import { parseAbi } from '../../src/lib/parseAbi';
import { handleChangeValidated } from '../../src/misc/handleChangeValidated';
import { WithError } from '../../src/misc/types';
import { hexSchema } from '../../src/misc/validation/schemas/hexSchema';
import { abiValidator } from '../../src/misc/validation/validators/abiValidator';
import { hexValidator } from '../../src/misc/validation/validators/hexValidator';

interface MappedDecodedResult {
  fnName?: string;
  fnType?: string;
  decoded: Decoded;
  inputs: ParamType[];
}

export default function CalldataDecoder(): ReactElement {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const [tab, setTab] = useState<'abi' | '4-bytes'>('4-bytes');
  const [decodeResults, setDecodeResults] = useState<MappedDecodedResult[]>([]);

  const [rawAbi, setRawAbi] = useState<WithError<string>>({ value: '' });
  const [encodedCalldata, setEncodedCalldata] = useState<WithError<string>>({
    value: '',
  });

  const signatureHash = useMemo(
    () => encodedCalldata.value && sigHashFromCalldata(encodedCalldata.value),
    [encodedCalldata],
  );

  const decodeButtonDisabled = !(tab === 'abi'
    ? rawAbi.value &&
      encodedCalldata.value &&
      !rawAbi.error &&
      !encodedCalldata.error
    : encodedCalldata.value && !encodedCalldata.error);

  const decodeIsPossible = encodedCalldata.value && !encodedCalldata.error;

  const decodeWithAbiIsPossible =
    decodeIsPossible && rawAbi.value && !rawAbi.error;

  const flushResults = (): void => {
    if (decodeResults.length > 0) setDecodeResults([]);
  };

  const handleChangeEncodedCalldata = (newValue: string): void =>
    handleChangeValidated({
      newValue,
      validateFn: (newValue) => hexValidator(newValue),
      setState: setEncodedCalldata,
      flushFn: flushResults,
    });

  const handleChangeRawAbi = (newValue: string): void =>
    handleChangeValidated({
      newValue,
      validateFn: (newValue) => abiValidator(newValue),
      setState: setRawAbi,
      flushFn: flushResults,
    });

  async function handleDecodeCalldataWith4Bytes(): Promise<void> {
    setLoading(true);
    try {
      const decodeResults = await decodeWithCalldata(
        signatureHash!,
        encodedCalldata.value,
      );
      if (!decodeResults) setError('Signature is wrong or undefined');
      else {
        const mappedResults = decodeResults.map((decoded) => {
          return {
            fnName: decoded.fragment.name,
            fnType: decoded.fragment.type,
            decoded: decoded.decoded,
            inputs: decoded.fragment.inputs,
          };
        });
        setDecodeResults(mappedResults);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleDecodeCalldataWithAbi(): void {
    const abi = parseAbi(rawAbi.value);
    if (abi instanceof Error) {
      return setRawAbi({
        ...rawAbi,
        error:
          "Provided ABI was in the wrong format or it didn't matched calldata",
      });
    }
    if (abi instanceof Interface) {
      const decodeResult = decodeCalldata(abi, encodedCalldata.value);
      if (!decodeResult)
        return setRawAbi({
          ...rawAbi,
          error: 'Signature is wrong or undefined',
        });

      const { decoded, fragment } = decodeResult;
      return setDecodeResults([
        {
          inputs: fragment.inputs,
          fnName: fragment.name,
          fnType: fragment.type,
          decoded,
        },
      ]);
    }
  }

  async function handleDecodeCalldata(): Promise<void> {
    setError(undefined);
    if (!signatureHash) {
      setError('Signature hash is missing, is calldata empty?');
    } else {
      if (tab === '4-bytes' && decodeIsPossible)
        return void handleDecodeCalldataWith4Bytes();
      else if (tab === 'abi' && decodeWithAbiIsPossible)
        return handleDecodeCalldataWithAbi();
    }
  }

  return (
    <ToolContainer>
      <Header
        icon={<DecodersIcon height={24} width={24} />}
        text={['Decoders', 'Calldata Decoder']}
      />
      <TextArea
        name="calldata"
        error={encodedCalldata.error}
        value={encodedCalldata.value}
        placeholder="e.g 0x23b8..3b2"
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
          handleChangeEncodedCalldata(event.target.value)
        }
        onPaste={async (event: ClipboardEvent<HTMLTextAreaElement>) => {
          const encodedCalldata = event.clipboardData.getData('Text');
          const sigHash = sigHashFromCalldata(encodedCalldata);
          if (sigHash) {
            await fetch4BytesBy.Signatures(sigHash);
          }
        }}
      />
      <div className="mt-6 flex flex-col">
        <AbiSourceTabs
          rawAbi={rawAbi}
          setDecodeResults={setDecodeResults}
          handleChangeRawAbi={(event) => handleChangeRawAbi(event.target.value)}
          tabState={{ tab, setTab }}
        />
      </div>
      <Button
        className="mt-6"
        disabled={decodeButtonDisabled}
        title={decodeButtonDisabled ? 'Please fill in the calldata' : undefined}
        onClick={handleDecodeCalldata}
      >
        Decode
      </Button>

      <section className="pt-8 pb-3">
        {decodeResults.length > 0 ? (
          <p className="text-md pb-4 font-semibold">
            Possible decoded results:
          </p>
        ) : (
          <p>Decoded output will appear here if any results are found</p>
        )}
      </section>

      <CalldataResult
        loading={loading}
        error={error}
        signatureHash={signatureHash}
        encodedCalldata={encodedCalldata.value}
        decodeResults={decodeResults}
      />
    </ToolContainer>
  );
}

// @internal
function CalldataResult({
  loading,
  error,
  decodeResults,
  signatureHash,
  encodedCalldata,
}: CalldataResultProps): ReactElement {
  return loading ? (
    <Spinner className="mx-auto pt-6" />
  ) : decodeResults.length > 0 ? (
    <section
      className="relative mb-16 rounded-md border border-gray-600 bg-gray-900 p-8"
      placeholder="Output"
    >
      <section className="flex flex-col gap-4">
        {!error && (
          <div>
            {signatureHash &&
              decodeResults.length > 0 &&
              hexSchema.safeParse(signatureHash).success && (
                <div className="flex items-center gap-3">
                  <p className="text-purple-400 font-bold">Signature hash</p>
                  <div
                    className="m-0 flex h-10 cursor-pointer items-center gap-2 rounded-md 
                          border border-gray-600 py-2 px-3 duration-200 hover:bg-gray-700
                          hover:outline active:bg-gray-800"
                  >
                    <b aria-label="signature hash">{signatureHash}</b>
                  </div>
                </div>
              )}
          </div>
        )}

        {error ? (
          <p className="text-error">
            {error} with `{encodedCalldata.slice(0, 12)}
            `... encoded calldata
          </p>
        ) : (
          <div className="items-left flex flex-col text-ellipsis">
            {decodeResults.map((decoded, i) => {
              return (
                <section key={i} data-testid={`decodedCalldataTree${i}`}>
                  <div className="pb-4">
                    <DecodedCalldataTree
                      fnName={decoded.fnName}
                      fnType={decoded.fnType}
                      decoded={decoded.decoded}
                      inputs={decoded.inputs}
                    />
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </section>
    </section>
  ) : (
    <div></div>
  );
}

// @internal
interface CalldataResultProps {
  error?: string;
  loading: boolean;
  signatureHash: string | undefined;
  encodedCalldata: string;
  decodeResults: MappedDecodedResult[];
}
