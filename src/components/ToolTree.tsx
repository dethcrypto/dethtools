import { Disclosure } from '@headlessui/react';
import React, { ReactElement } from 'react';

import { MyLink } from '../components/MyLink';
import { CalculatorIcon } from './icons/CalculatorIcon';
import { DecodersIcon } from './icons/DecodersIcon';
import { EncodersIcon } from './icons/EncodersIcon';
import { MinusIcon } from './icons/MinusIcon';
import { PlusIcon } from './icons/PlusIcon';

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

export function ToolTree({
  className,
  isShowMobileTree,
  isMobile,
}: {
  className?: string;
  isShowMobileTree: boolean;
  isMobile: boolean;
}): ReactElement {
  return (
    <>
      {isShowMobileTree && isMobile ? (
        <section
          className={`absolute top-0 left-0 z-10 mt-32 h-full w-full bg-gray-900 ${className}`}
        >
          <ToolTreeElements className="mx-8 mt-8" />
        </section>
      ) : (
        <section className={`hidden w-4/12 md:block lg:ml-0 ${className}`}>
          <ToolTreeElements />
        </section>
      )}
    </>
  );
}

const tree: Tree = {
  calculators: {
    icon: <CalculatorIcon height={20} width={20} />,
    tools: [
      { title: 'Eth Unit Conversion', pageHref: 'eth-unit-conversion' },
      { title: 'Token Unit Conversion', pageHref: 'token-unit-conversion' },
      { title: 'Base Conversion', pageHref: 'base-conversion' },
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
};

interface Tool {
  title: string;
  pageHref: string;
  iconHref?: string;
  isNew?: boolean;
}

// optionally soon add more alternative values to Tree rows
type Tree = { [key: string]: { icon: JSX.Element; tools: Tool[] } };
