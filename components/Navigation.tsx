import Image from 'next/image'

import { MyLink } from './MyLink'

export function Navigation() {
  return (
    <nav
      className="flex items-center h-20 mx-auto
      justify-between pt-6 pb-4 border-b border-gray-600"
    >
      <section className="flex items-center">
        <Image
          className="cursor-pointer"
          src="/static/svg/deth-tools.svg"
          width={40}
          height={40}
          alt="deth tools logo"
        />
        <h1 className="text-4xl font-syne text-gray-900 cursor-pointer">Deth Tools</h1>
      </section>

      <section className="flex gap-4 items-center">
        <MyLink href="/">
          <p
            className="border-gray-900 border py-2 px-4
          hover:bg-black hover:text-white"
          >
            Let's get started
          </p>
        </MyLink>

        <Image
          className="cursor-pointer hover:bg-blue-200 rounded-full"
          src="/static/svg/github.svg"
          width={26}
          height={26}
          alt="deth tools github logo"
        />
      </section>
    </nav>
  )
}
