import {
  formatBytes32String,
  parseBytes32String,
} from '@ethersproject/strings';
import {
  ComponentPropsWithoutRef,
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
} from 'react';

import { decodeHex, encodeHex } from '../../../../src/lib/decodeHex';

export function HexDecToggle({
  isDisabled = false,
  state,
  setState,
  isStateFn,
}: ToggleWithSideEffectProps<string, string>): ReactElement {
  return ToggleWithSideEffect<string, string>({
    isDisabled,
    state,
    isStateFn,
    setState,
    buttonNames: ['hex', 'dec'],
    encoderAndDecoder: { encoder: encodeHex, decoder: decodeHex },
    className,
  });
}

export function Bytes32StringToggle({
  isDisabled = false,
  state,
  setState,
  isStateFn,
}: ToggleWithSideEffectProps<string, string>): ReactElement {
  return ToggleWithSideEffect<string, string>({
    isDisabled,
    state,
    isStateFn,
    setState,
    buttonNames: ['bytes32', 'string'],
    encoderAndDecoder: {
      encoder: formatBytes32String,
      decoder: parseBytes32String,
    },
    className,
  });
}

export function Toggle({
  buttonNames,
  isDisabled = false,
  useExternalState,
  className,
  ...props
}: ToggleProps): ReactElement {
  const [leftToggleHalf, rightToggleHalf] = buttonNames;
  const [externalState, setExternalState] = useExternalState;

  return (
    <div
      className={`flex ${className}`}
      aria-label={`${leftToggleHalf}-${rightToggleHalf} toggle`}
      {...props}
    >
      <button
        aria-label={`${leftToggleHalf}-${rightToggleHalf} left toggle button`}
        disabled={isDisabled}
        onClick={() => setExternalState(true)}
        className={switchButtonStyle(isDisabled, externalState, true)}
      >
        <p aria-label="toggle left half label">{leftToggleHalf}</p>
      </button>
      <button
        aria-label={`${leftToggleHalf}-${rightToggleHalf} right toggle button`}
        disabled={isDisabled}
        onClick={() => setExternalState(false)}
        className={switchButtonStyle(isDisabled, !externalState, false)}
      >
        <p aria-label="toggle left half label">{rightToggleHalf}</p>
      </button>
    </div>
  );
}

interface ToggleProps extends ComponentPropsWithoutRef<'div'> {
  buttonNames: [string, string];
  useExternalState: [boolean, (newValue: boolean) => void];
  isDisabled?: boolean;
}

// @internal
function ToggleWithSideEffect<T, R>({
  isDisabled,
  state,
  setState,
  encoderAndDecoder,
  buttonNames,
  isStateFn,
  className,
}: Toggle<T, R>): ReactElement {
  const { isState, inner } = state;
  const { encoder, decoder } = encoderAndDecoder;
  const [leftToggleHalf, rightToggleHalf] = buttonNames;

  useEffect(() => {
    if (isStateFn(state.inner)) {
      try {
        setState({ isState: true, inner: encoder(state.inner as T) });
      } catch (e) {
        // consume error here to prevent it bubbling up
        // (it shouldn't throw when the results are displayed)
      }
    } else {
      try {
        setState({ isState: false, inner: decoder(state.inner as R) });
      } catch (e) {
        // s/a
      }
    }
  }, [decoder, encoder, isStateFn, setState, state.inner, state.isState]);

  return (
    <div
      aria-label={`${leftToggleHalf}-${rightToggleHalf} toggle`}
      className="flex"
    >
      <button
        type="button"
        aria-label="left toggle button"
        disabled={isDisabled}
        aria-disabled={isDisabled}
        onClick={() => {
          try {
            setState({ isState: true, inner: encoder(inner as T) });
          } catch (e) {
            // s/a
          }
        }}
        className={switchButtonStyle(isDisabled!, !isState, true)}
      >
        <p aria-label="toggle left half">{leftToggleHalf}</p>
      </button>

      <button
        type="button"
        aria-label="right toggle button"
        disabled={isDisabled}
        aria-disabled={isDisabled}
        onClick={() => {
          try {
            setState({ isState: false, inner: decoder(inner as R) });
          } catch (e) {
            // s/a
          }
        }}
        className={switchButtonStyle(isDisabled!, isState, false)}
      >
        <p aria-label="toggle left half">{rightToggleHalf}</p>
      </button>
    </div>
  );
}

// Public type hiding the impl. details of the toggle.
export type ToggleWithSideEffectProps<T, R> = Omit<
  Toggle<T, R>,
  'encoderAndDecoder' | 'buttonNames'
>;

const switchButtonStyle = (
  isDisabled: boolean,
  isState: boolean,
  isLeftSide: boolean,
): string =>
  `grow-0 cursor-pointer border bg-gray-800 border-gray-500 bg-gray-700 py-0.5 px-3 ${
    isDisabled && 'opacity-30 cursor-not-allowed'
  } duration-400 hover:bg-gray-700 active:bg-gray-800 ${
    isState && !isDisabled && 'border-gray-100'
  } ${isLeftSide ? 'rounded-l-md border-r' : 'rounded-r-md border-l'}`;

/**
 * @internal
 * @param T - the type of the first half of the toggle
 * @param R - the type of the second half of the toggle
 * @param isStateFn - a function that returns true if the state is in the first half
 * @param encoderAndDecoder - an object with encoder and decoder functions
 * @param buttonNames - an array of strings to display on the buttons [firstHalf, secondHalf]
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
interface Toggle<T, R> {
  isDisabled?: boolean;
  buttonNames: [string, string];
  /**
   * State hook that returns whether the state is in the left half, and the state itself.
   */
  state: { isState: boolean; inner: T | R };
  /**
   * State hook that sets the state.
   */
  setState: Dispatch<SetStateAction<{ isState: boolean; inner: T | R }>>;
  /**
   * A function that returns true if the state is in the first half.
   * e.g isStateFn = isHex(...): boolean
   */
  isStateFn: (inner: T | R) => boolean;
  /**
   * Encoder and decoder functions respectively to [T => R, R => T].
   */
  encoderAndDecoder: { encoder: (value: T) => R; decoder: (value: R) => T };
}
