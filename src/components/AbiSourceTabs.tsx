import React, {
  ChangeEvent,
  Dispatch,
  ReactElement,
  SetStateAction,
  TextareaHTMLAttributes,
} from 'react';

import { WithOkAndErrorMsgOptional } from '../misc/types';

interface AbiSourceTabsProps<T, D> {
  rawAbi: T;
  tabState: {
    tab: 'abi' | '4-bytes';
    setTab: Dispatch<SetStateAction<'abi' | '4-bytes'>>;
  };
  setDecodeResults: Dispatch<React.SetStateAction<D>>;
  handleChangeRawAbi: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

export function AbiSourceTabs<
  R extends TextareaHTMLAttributes<HTMLTextAreaElement>['value'],
  T extends WithOkAndErrorMsgOptional<R>,
  D,
>({
  rawAbi,
  setDecodeResults,
  handleChangeRawAbi,
  tabState,
}: AbiSourceTabsProps<T, D>): ReactElement {
  const { tab, setTab } = tabState;
  return (
    <div className="flex flex-col">
      <div className="flex text-lg">
        <button
          role="tab"
          aria-selected={tab === '4-bytes'}
          className={
            `h-12 flex-1 cursor-pointer p-1
            text-center duration-300 active:scale-105 active:bg-pink/50 ${
              tab === '4-bytes'
                ? 'rounded-l-md bg-pink'
                : 'rounded-tl-md bg-gray-600'
            }` + String(rawAbi.isOk ? ' border-gray-600' : ' border-error')
          }
          onClick={() => {
            setTab('4-bytes');
            // @ts-ignore - this is a valid state change
            setDecodeResults(undefined);
          }}
        >
          4 bytes
        </button>

        <button
          role="tab"
          aria-selected={tab === 'abi'}
          className={
            `h-12 flex-1 cursor-pointer p-1
            text-center duration-300 active:scale-105 active:bg-pink/50 ${
              tab === 'abi'
                ? 'rounded-tr-md bg-pink'
                : 'rounded-r-md bg-gray-600'
            }` + String(rawAbi.isOk ? ' border-gray-600' : ' bg-error/75')
          }
          onClick={() => {
            setTab('abi');
            // @ts-ignore - this is a valid state change
            setDecodeResults(undefined);
          }}
        >
          ABI
        </button>
      </div>

      {tab === 'abi' && (
        <>
          <textarea
            id="abi"
            aria-label="text area for abi"
            value={
              // Cast inner to 'always present', as we always want to
              // display the abi, even if it's wrong
              (
                rawAbi as WithOkAndErrorMsgOptional<string> & {
                  inner: string;
                }
              ).inner || ''
            }
            placeholder="e.g function transferFrom(address, ..)"
            className={
              'flex h-48 w-full break-words rounded-b-md border-t-0 bg-gray-900 p-5' +
              String(rawAbi.isOk ? ' border-gray-600' : ' border-error/75')
            }
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              handleChangeRawAbi(event)
            }
          />
          <p aria-label="raw abi error" className="pt-1 text-right text-error">
            {!rawAbi.isOk && rawAbi.errorMsg}
          </p>
        </>
      )}
    </div>
  );
}
