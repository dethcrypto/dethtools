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
]

function ToolList() {
  return (
    <section className="absolute top-52 left-1/6">
      <div className="flex flex-col">
        {tools.map((t) => {
          return (
            <div key={t.title} className="flex mb-4 border-b rounded-lg border-gray-200 dark:border-gray-700">
              <MyLink href={`/dashboard/${t.pageHref}`}>
                <button
                  className="flex items-center h-12 px-2 py-2 gap-3 text-center
                text-black whitespace-nowrap focus:outline-none
                hover:bg-black hover:text-gray-200 rounded-xl"
                >
                  <p className="hover:text-white"> {t.title} </p>
                </button>
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
    <main className="max-w-4xl mx-auto">
      <ThemeProvider attribute="class" defaultTheme="light">
        <Navigation />
        <div className="flex mx-auto max-w-6xl items-center gap-12">
          <ToolList />
        </div>
        <Component className="max-w-1/2" {...pageProps} />
      </ThemeProvider>
    </main>
  )
}
