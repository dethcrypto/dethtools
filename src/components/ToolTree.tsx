import { Disclosure } from '@headlessui/react';
import Img from 'next/image';

import { MyLink } from '../components/MyLink';

export function ToolTree() {
  return (
    <section className=" top-52 w-56">
      <div className="flex flex-col">
        {Object.entries(tree).map(([key, value]) => (
          <Disclosure key={key} defaultOpen={true}>
            {({ open }) => (
              <>
                <Disclosure.Button className=" mt-2 flex items-center justify-between gap-2">
                  <h2> {key} </h2>
                  {open ? (
                    <Img
                      className="text-red-100"
                      src="/static/svg/minus.svg"
                      width={18}
                      height={18}
                    />
                  ) : (
                    <Img
                      className="text-red-100"
                      src="/static/svg/plus.svg"
                      width={18}
                      height={18}
                    />
                  )}
                </Disclosure.Button>

                {(value as Tool[]).map((tool) => (
                  <Disclosure.Panel
                    key={tool.title}
                    className="min-w-38 mt-3 flex flex-col items-start"
                  >
                    <MyLink
                      href={`/${tool.pageHref}`}
                      className="mr-auto flex h-10 items-center rounded-lg px-4 hover:bg-black hover:text-white"
                    >
                      {tool.isNew && (
                        <p className="mr-2 rounded-lg bg-purple-200 px-0.5">
                          {' '}
                          NEW{' '}
                        </p>
                      )}
                      {tool.title}
                    </MyLink>
                  </Disclosure.Panel>
                ))}
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </section>
  );
}

const tree: Tree = {
  calculators: [
    { title: 'Eth Unit Conversion', pageHref: 'eth-unit-conversion' },
    { title: 'Token Unit Conversion', pageHref: 'token-unit-conversion' },
  ],
  decoders: [
    { title: 'Calldata Decoder', pageHref: 'calldata-decoder', isNew: true },
    { title: 'Event Decoder', pageHref: 'event-decoder', isNew: true },
  ],
};

interface Tool {
  title: string;
  pageHref: string;
  iconHref?: string;
  isNew?: boolean;
}

// optionally soon add more alternative values to Tree rows
type Tree = { [key: string]: Tool[] };
