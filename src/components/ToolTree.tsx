import { Disclosure } from '@headlessui/react';
import React, { ReactElement } from 'react';

import { MyLink } from '../components/MyLink';
import { CalculatorIcon } from './icons/CalculatorIcon';
import { DecodersIcon } from './icons/DecodersIcon';
import { EncodersIcon } from './icons/EncodersIcon';
import { GeneratorIcon } from './icons/GeneratorIcon';
import { MinusIcon } from './icons/MinusIcon';
import { PlusIcon } from './icons/PlusIcon';
import { NavigationSocial } from './NavigationSocial';

interface ToolTreeProps extends React.ComponentPropsWithoutRef<'section'> {
  showMobileTree: boolean;
}

export function ToolTree({
  showMobileTree,
  ...props
}: ToolTreeProps): ReactElement {
  return (
    <>
      {showMobileTree && (
        <section
          {...props}
          className={`absolute top-0 left-0 z-10 mt-32 block h-full w-full bg-gray-900 sm:hidden ${props.className}`}
        >
          <ToolTreeElements className="mx-8 mt-8" />
          <NavigationSocial className="mx-10 mt-12 flex items-center justify-between gap-12 sm:hidden" />
        </section>
      )}
      <section
        {...props}
        className={`hidden w-4/12 sm:block lg:ml-0 ${props.className}`}
      >
        <ToolTreeElements />
      </section>
    </>
  );
}

// @internal
function ToolTreeElements({ className }: { className?: string }): ReactElement {
  return (
    <div className={`items-start" flex flex-col ${className}`}>
      {Object.entries(tree).map(([key, value]) => (
        <Disclosure key={key} defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button className="mt-6 flex items-center justify-between">
                <div className="flex gap-3">
                  {value.icon}
                  <p className="uppercase text-gray-300"> {key} </p>
                </div>
                {open ? (
                  <MinusIcon width={18} height={18} />
                ) : (
                  <PlusIcon width={18} height={18} />
                )}
              </Disclosure.Button>

              {value.tools.map((tool) => (
                <Disclosure.Panel
                  key={tool.title}
                  className="min-w-38 mt-2 flex flex-col items-start"
                >
                  <MyLink
                    href={`/${tool.pageHref}`}
                    className="flex h-10 items-center justify-between rounded-lg px-4 hover:bg-gray-600 hover:text-white"
                  >
                    {tool.isNew && (
                      <p className="mr-4 rounded-lg bg-purple/25 px-2 tracking-wide text-white duration-700">
                        NEW
                      </p>
                    )}
                    <p className="text-white">{tool.title}</p>
                  </MyLink>
                </Disclosure.Panel>
              ))}
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
}

// @internal
const tree: Tree = {
  calculators: {
    icon: <CalculatorIcon height={20} width={20} />,
    tools: [
      { title: 'Eth Unit Conversion', pageHref: 'eth-unit-conversion' },
      { title: 'Token Unit Conversion', pageHref: 'token-unit-conversion' },
      {
        title: 'Unix Epoch - UTC Conversion',
        pageHref: 'unix-epoch-utc-conversion',
      },
      { title: 'Base Conversion', pageHref: 'base-conversion' },
      {
        title: 'String Bytes32 Conversion',
        pageHref: 'string-bytes32-conversion',
      },
    ],
  },
  decoders: {
    icon: <DecodersIcon height={20} width={20} />,
    tools: [
      { title: 'Calldata Decoder', pageHref: 'calldata-decoder' },
      { title: 'Event Decoder', pageHref: 'event-decoder' },
      { title: 'Tx Decoder', pageHref: 'tx-decoder' },
    ],
  },
  encoders: {
    icon: <EncodersIcon height={20} width={20} />,
    tools: [
      {
        title: 'Constructor Encoder',
        pageHref: 'constructor-encoder',
      },
    ],
  },
  generators: {
    icon: <GeneratorIcon height={20} width={20} />,
    tools: [
      {
        title: 'Vanity Address Generator',
        pageHref: 'vanity-address-generator',
      },
    ],
  },
};

// @internal
interface Tool {
  title: string;
  pageHref: string;
  iconHref?: string;
  isNew?: boolean;
}

// optionally soon add more alternative values to Tree rows
type Tree = { [key: string]: { icon: JSX.Element; tools: Tool[] } };
