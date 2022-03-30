import { Disclosure } from '@headlessui/react';

import CalculatorSvg from '../../public/static/svg/calculator';
import DecoderSvg from '../../public/static/svg/decoders';
import MinusSvg from '../../public/static/svg/minus';
import PlusSvg from '../../public/static/svg/plus';
import { MyLink } from '../components/MyLink';

function ToolTreeElements({ className }: { className?: string }) {
  return (
    <div className={`items-start" flex flex-col ${className}`}>
      {Object.entries(tree).map(([key, value]) => (
        <Disclosure key={key} defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button className="mt-6 flex items-center justify-between">
                <div className="flex gap-3">
                  {value.icon}
                  <p className="uppercase text-deth-gray-300"> {key} </p>
                </div>
                {open ? (
                  <MinusSvg width={18} height={18} />
                ) : (
                  <PlusSvg width={18} height={18} />
                )}
              </Disclosure.Button>

              {value.tools.map((tool) => (
                <Disclosure.Panel
                  key={tool.title}
                  className="min-w-38 mt-2 flex flex-col items-start"
                >
                  <MyLink
                    href={`/${tool.pageHref}`}
                    className="mr-auto flex h-10 items-center rounded-lg px-4 hover:bg-deth-gray-600 hover:text-white"
                  >
                    {tool.isNew && (
                      <p className="mr-4 animate-pulse rounded-lg bg-deth-purple px-2 font-semibold text-deth-white duration-700">
                        NEW
                      </p>
                    )}
                    <p className="text-deth-white">{tool.title}</p>
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
}) {
  return (
    <>
      {isShowMobileTree && isMobile ? (
        <section
          className={`absolute top-0 left-0 z-10 mt-32 h-full w-full bg-deth-gray-900 ${className}`}
        >
          <ToolTreeElements className="mx-8 mt-8" />
        </section>
      ) : (
        <section className={`hidden w-5/12 md:block lg:ml-0 ${className}`}>
          <ToolTreeElements />
        </section>
      )}
    </>
  );
}

const tree: Tree = {
  calculators: {
    icon: <CalculatorSvg height={20} width={20} />,
    tools: [
      { title: 'Eth Unit Conversion', pageHref: 'eth-unit-conversion' },
      { title: 'Token Unit Conversion', pageHref: 'token-unit-conversion' },
    ],
  },
  decoders: {
    icon: <DecoderSvg height={20} width={20} />,
    tools: [
      { title: 'Calldata Decoder', pageHref: 'calldata-decoder', isNew: true },
      { title: 'Event Decoder', pageHref: 'event-decoder', isNew: true },
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