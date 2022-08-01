import {
  ReactElement,
  useState,
  SVGProps,
  Dispatch,
  SetStateAction,
} from 'react';
import { WithError } from '../../src/misc/types';
import { ConversionInput } from './ConversionInput';
import type { Primitive } from 'ts-essentials';

export function InputWithPredefinedValues<T extends WithError<Primitive>>({
  icon,
  name,
  predefinedValues,
  useExternalState,
  onChange,
  ...props
}: InputWithPredefinedValuesProps<T>): ReactElement {
  const [state, setState] = useExternalState;
  const [showPredefined, setShowPredefined] = useState(false);

  return (
    <div {...props} className={`relative ${props.className}`}>
      <ConversionInput
        className="w-full pr-10"
        name={name}
        value={String(state.value)}
        error={state.error}
        type={typeof state.value === 'string' ? 'text' : 'number'}
        onChange={onChange}
      />
      <div
        aria-label={`predefined ${name} button`}
        className="absolute top-10 right-4 z-50 cursor-pointer duration-200 hover:scale-105 active:scale-90"
        onClick={() => setShowPredefined(!showPredefined)}
      >
        {icon}
      </div>

      <section
        aria-label={`predefined ${name} dropdown`}
        className={`absolute z-10 w-full rounded-md border border-gray-600 bg-gray-800 px-4 py-3 shadow-md ${
          showPredefined ? 'opacity-1 block select-none' : 'hidden opacity-0'
        }`}
      >
        {[...predefinedValues].map(({ label, value }) => {
          return (
            <div
              aria-label={`${label} predefined row`}
              key={label}
              onClick={() => {
                setState({ value } as T);
                setShowPredefined(!showPredefined);
              }}
              className="flex cursor-pointer rounded-md py-2 px-2 duration-200 
              hover:bg-gray-600 active:scale-95"
            >
              <p aria-label={`predefined ${label} label`}>{label}</p>
              <sup
                aria-label={`predefined ${label} value`}
                className="inline-block text-sm leading-none text-gray-300"
              >
                {value}
              </sup>
            </div>
          );
        })}
      </section>
    </div>
  );
}

type PredefinedValue = { value: Primitive; label: string };

interface InputWithPredefinedValuesProps<T extends WithError<Primitive>>
  extends React.ComponentPropsWithoutRef<'div'> {
  icon: ReactElement<SVGProps<SVGSVGElement>>;
  name: string;
  useExternalState: [T, Dispatch<SetStateAction<T>>];
  predefinedValues: Set<PredefinedValue>;
}
