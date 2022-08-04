import { Interface } from '@ethersproject/abi';
import {
  ChangeEvent,
  ClipboardEvent,
  ReactElement,
  useMemo,
  useState,
} from 'react';

import { AbiSourceTabs } from '../../src/components/AbiSourceTabs';
import { CopyableConversionInput } from '../../src/components/CopyableConversionInput';
import { DecodersIcon } from '../../src/components/icons/DecodersIcon';
import { Button } from '../../src/components/lib/Button';
import { NodeBlock } from '../../src/components/NodeBlock';
import { Spinner } from '../../src/components/Spinner';
import { ToolContainer } from '../../src/components/ToolContainer';
import { ToolHeader } from '../../src/components/ToolHeader';
import {
  decodeWithEventProps,
  fetch4BytesBy,
} from '../../src/lib/decodeBySigHash';
import {
  DecodedEventResult,
  decodeEvent,
  EventProps,
} from '../../src/lib/decodeEvent';
import { parseAbi } from '../../src/lib/parseAbi';
import { handleChangeValidated } from '../../src/misc/handleChangeValidated';
import { parseEthersErrorMessage } from '../../src/misc/parseEthersErrorMessage';
import { WithError } from '../../src/misc/types';
import { abiValidator } from '../../src/misc/validation/validators/abiValidator';
import { hexValidator } from '../../src/misc/validation/validators/hexValidator';

const stateBeforeIndex = (
  state: WithError<string>[],
  index: number,
): WithError<string>[] => {
  return [...state.slice(0, index)];
};

const stateAfterIndex = (
  state: WithError<string>[],
  index: number,
): WithError<string>[] => {
  return [...state.slice(index + 1)];
};

export default function EventDecoder(): ReactElement {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [tab, setTab] = useState<'abi' | '4-bytes'>('4-bytes');
  const [rawAbi, setRawAbi] = useState<WithError<string>>({ value: '' });
  const [data, setData] = useState<WithError<string>>({ value: '' });
  const [topics, setTopics] = useState<WithError<string>[]>([
    { value: '' },
    { value: '' },
    { value: '' },
    { value: '' },
  ]);
  const [decodeResults, setDecodeResults] = useState<DecodedEventResult[]>([]);

  const signatureHash = useMemo(() => topics.length > 0 && topics[0], [topics]);

  const decodeIsPossible =
    topics[0].value &&
    topics.every((topic) => !topic.error) &&
    data.value &&
    !data.error;

  const decodeWithAbiIsPossible =
    decodeIsPossible && rawAbi.value && !rawAbi.error;

  const decodeButtonDisabled = !(
    !data.error &&
    data.value &&
    topics.every(({ error }) => !error) &&
    (rawAbi.value || tab === '4-bytes')
  );

  const decodeResultsDisabled = !error && decodeResults.length === 0;

  const flushResults = (): void => {
    if (decodeResults.length > 0) setDecodeResults([]);
  };

  const setTopic = ({
    index,
    ...props
  }: {
    index: number;
    value?: string;
    error?: string;
  }): void => {
    setTopics((state) => {
      return [
        ...stateBeforeIndex(state, index),
        {
          ...state[index],
          ...props,
        },
        ...stateAfterIndex(state, index),
      ];
    });
  };

  const handleChangeTopic = (index: number, newValue: string): void =>
    handleChangeValidated({
      newValue,
      validateFn: (newValue) => hexValidator(newValue),
      setState: setTopic,
      flushFn: flushResults,
      index,
    });

  const handleChangeData = (newValue: string): void =>
    handleChangeValidated({
      newValue,
      validateFn: (newValue) => hexValidator(newValue),
      setState: setData,
      flushFn: flushResults,
    });

  const handleChangeRawAbi = (newValue: string): void =>
    handleChangeValidated({
      newValue,
      validateFn: (newValue) => abiValidator(newValue),
      setState: setRawAbi,
      flushFn: flushResults,
    });

  async function handleDecodeCalldata(): Promise<void> {
    setError(undefined);
    if (tab === '4-bytes' && decodeIsPossible)
      return void handleDecodeEventWith4Bytes();
    else if (tab === 'abi' && decodeWithAbiIsPossible)
      return handleDecodeEventWithAbi();
  }

  async function handleDecodeEventWith4Bytes(): Promise<void> {
    setLoading(true);
    try {
      const eventProps: EventProps = {
        data: data.value,
        topics: topics
          .filter((topic) => {
            return topic.value.trim().length > 0;
          })
          .map((topic) => topic.value),
      };
      const decodeResults = await decodeWithEventProps(
        (signatureHash as WithError<string>).value,
        eventProps,
      );
      if (decodeResults) {
        setError(undefined);
        setDecodeResults(decodeResults);
      }
    } catch (e) {
      setError(
        "Provided event couldn't be decoded, maybe there are too few topics?",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleDecodeEventWithAbi(): void {
    const abi = parseAbi(rawAbi.value);

    if (abi instanceof Error)
      return setRawAbi({
        ...rawAbi,
        error: parseEthersErrorMessage(abi.message),
      });
    else if (abi instanceof Interface) {
      const eventProps: EventProps = {
        data: data.value,
        topics: topics
          .filter((topic) => {
            return topic.value.trim().length > 0;
          })
          .map((topic) => topic.value),
      };

      const decodeResult = decodeEvent(abi, eventProps);
      setDecodeResults([decodeResult]);
    }
  }

  return (
    <ToolContainer>
      <ToolHeader
        icon={<DecodersIcon height={24} width={24} />}
        text={['Decoders', 'Event Decoder']}
      />
      <>
        <section className="mb-4">
          {topics.map((_, index) => (
            <section className="mb-2 flex flex-1 flex-col" key={index}>
              <CopyableConversionInput
                name={`topic${index}`}
                id={`${index}`}
                type="text"
                placeholder="0x0.."
                error={topics[index].error}
                className={`${
                  !topics[index].error ? 'border-gray-600' : 'border-error/75'
                }`}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleChangeTopic(index, event.target.value)
                }
                onPaste={async (event: ClipboardEvent<HTMLInputElement>) => {
                  handleChangeTopic(
                    index,
                    event.clipboardData.getData('text/plain'),
                  );
                  if (index !== 0) return;
                  const topicValue = event.clipboardData.getData('Text');
                  const sigHash = topicValue;
                  if (sigHash) {
                    await fetch4BytesBy.EventSignatures(sigHash);
                  }
                }}
              />
            </section>
          ))}
        </section>
        <CopyableConversionInput
          name="data"
          type="text"
          placeholder="0x0.."
          error={data.error}
          className={`${!data.error ? 'border-gray-600' : 'border-error/75'}`}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleChangeData(event.target.value)
          }
        />
      </>

      <div className="mt-6 flex flex-col">
        <AbiSourceTabs
          rawAbi={rawAbi}
          setDecodeResults={setDecodeResults}
          handleChangeRawAbi={(event) => handleChangeRawAbi(event.target.value)}
          tabState={{ tab, setTab }}
        />
      </div>

      <Button
        onClick={() => void handleDecodeCalldata()}
        className="mt-6"
        disabled={decodeButtonDisabled}
        title={
          decodeButtonDisabled
            ? 'Please fill in the topics, data and abi if this tab is selected'
            : undefined
        }
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

      {loading ? (
        <Spinner className="mx-auto pt-12" />
      ) : (
        !decodeResultsDisabled && (
          <section
            className="relative mb-16 rounded-md border border-gray-600 bg-gray-900 p-8"
            placeholder="Output"
          >
            <section className="flex flex-col gap-4 break-words">
              {signatureHash && decodeResults.length > 0 && (
                <NodeBlock className="my-2" str={signatureHash.value || '0x0'}>
                  <div className="flex items-center gap-2">
                    <p className="truncate">Signature hash</p>
                  </div>
                </NodeBlock>
              )}

              {error ? (
                <p className="text-error">{error}</p>
              ) : (
                <div className="items-left flex flex-col text-ellipsis">
                  {decodeResults.map((d, i) => {
                    return (
                      <section key={i}>
                        <div className="flex flex-col">
                          <div className="flex gap-3">
                            <code className="pb-2 font-bold text-purple">
                              {d.fullSignature.split(' ').slice(0, 1)}
                            </code>
                            <code className="pb-2">
                              {d.fullSignature
                                .split(' ')
                                .slice(1, d.fullSignature.length)
                                .join(' ')}
                            </code>
                          </div>
                          {Object.entries(d.args).map(([key, value], i) => (
                            <NodeBlock
                              className="my-1"
                              str={value.toString()}
                              key={i}
                            >
                              <p
                                aria-label="decoded event arg index"
                                className="text-gray-600"
                              >{`[${key}]`}</p>
                            </NodeBlock>
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              )}
            </section>
          </section>
        )
      )}
    </ToolContainer>
  );
}
