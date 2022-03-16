import '/css/globals.css'

import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'

import { MyLink } from '../components/MyLink'
import { Navigation } from '../components/Navigation'

interface Tool {
  title: string
  pageHref: string
  iconHref?: string
}

const tools: Tool[] = [
  { title: 'Eth Unit Conversion', pageHref: 'eth-unit-conversion' },
  { title: 'Token Unit Conversion', pageHref: 'token-unit-conversion' },
  { title: 'Calldata Decoder', pageHref: 'calldata-decoder' },
]

function ToolList() {
  return (
    <section className="left-1/6 absolute top-52">
      <div className="flex flex-col">
        {tools.map((t) => {
          return (
            <div key={t.title} className="mb-4 flex rounded-lg border-b border-gray-200 dark:border-gray-700">
              <MyLink href={`/${t.pageHref}`}>
                <div
                  className="flex h-12 items-center gap-3 whitespace-nowrap rounded-xl px-2
                py-2 text-center text-black
                hover:bg-black hover:text-white focus:outline-none"
                >
                  {t.title}
                </div>
              </MyLink>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className="mx-auto max-w-4xl">
      <ThemeProvider attribute="class" defaultTheme="light">
        <Navigation />
        <div className="mx-auto flex max-w-6xl items-center gap-12">
          <ToolList />
        </div>
        <Component className="max-w-1/2" {...pageProps} />
      </ThemeProvider>
    </main>
  )
}
