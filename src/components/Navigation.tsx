import Image from 'next/image';

import { MyLink } from './MyLink';

export function Navigation() {
  return (
    <nav
      className="mx-auto flex h-20 items-center
      justify-between border-b border-gray-600 pt-6 pb-4"
    >
      <section className="flex items-center">
        <Image
          className="cursor-pointer"
          src="/static/svg/deth-tools.svg"
          width={40}
          height={40}
          alt="deth tools logo"
        />
        <h1 className="cursor-pointer font-syne text-4xl text-gray-900">
          Deth Tools
        </h1>
      </section>

      <section className="flex items-center gap-4">
        <MyLink href={'/'}>
          <button
            className="border border-gray-900 py-2 px-4
          hover:bg-black hover:text-white"
          >
            Let's get started
          </button>
        </MyLink>

        <Image
          className="cursor-pointer rounded-full hover:bg-blue-200"
          src="/static/svg/github.svg"
          width={26}
          height={26}
          alt="deth tools github logo"
        />
      </section>
    </nav>
  );
}
