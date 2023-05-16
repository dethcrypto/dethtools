import React, {
  ComponentPropsWithoutRef,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
} from 'react';
import { ReactChildren } from 'src/types/util';

import { LinkIcon } from '../icons/LinkIcon';

const colors = require('../../../tailwind.config').theme.colors;

export type ChainDetailPanelElement = typeof ChainDetailPanelElements[number];

const ChainDetailPanelElements = [
  'RPC',
  'Explorers',
  'Faucets',
  'URL',
] as const;

function ChainDetailsRoot({
  children,
  ...props
}: ChainDetailsRootProps): ReactElement {
  return (
    <div className="flex items-center justify-between" {...props}>
      <div className="flex-col items-center">{children}</div>
    </div>
  );
}

interface ChainDetailsRootProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
}

// this type guard is really narrowed, as ReactNode
// could be also a boolean, null etc.,
// but for this use case it does its job
function isChildReactElement(
  children: ReactElement | ReactNode,
): children is ReactElement {
  return (
    (children && typeof children === 'object' && 'type' in children) || false
  );
}

function Element({
  children,
  type = 'button',
  selectedState,
  show = true,
  name,
}: ElementProps): ReactElement | null {
  const [selected, setSelected] = selectedState;

  return show ? (
    type === 'button' ? (
      <button
        name={name}
        onClick={() => {
          if (selected === name) setSelected(undefined);
          else setSelected(name);
        }}
        className={`${
          selected === 'RPC' ? 'text-white' : 'text-gray-300'
        } text-md cursor-pointer font-semibold capitalize`}
      >
        <p>
          {isChildReactElement(children) ? (
            React.cloneElement(children, {
              fill: `${name === selected ? 'white' : colors.gray[300]}`,
            })
          ) : (
            <>{children}</>
          )}
        </p>
      </button>
    ) : (
      <a href={children as string}>
        <LinkIcon
          fill={`${selected === children ? 'white' : colors.gray[300]}`}
          className="cursor-pointer"
        />
      </a>
    )
  ) : null;
}

interface ElementProps {
  type?: 'button' | 'link';
  show?: boolean;
  name: ChainDetailPanelElement;
  children: ReactElement | string;
  selectedState: [
    ChainDetailPanelElement | undefined,
    Dispatch<SetStateAction<ChainDetailPanelElement | undefined>>,
  ];
}

function Panel({ children }: ReactChildren): ReactElement {
  return <div className="flex items-center gap-3">{children}</div>;
}

function Data({ children }: ReactChildren): ReactElement {
  return <>{children}</>;
}

export const ChainDetails = Object.assign(ChainDetailsRoot, {
  Panel,
  Data,
  Element,
});
