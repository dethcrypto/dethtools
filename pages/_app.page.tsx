import '/css/globals.css'

import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'

import { Navigation } from '../components/Navigation'
import { ToolTree } from '../components/ToolTree'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className="mx-auto max-w-4xl">
      <ThemeProvider attribute="class" defaultTheme="light">
        <Navigation />
        <div className="mx-auto flex max-w-6xl items-center gap-12">
          <ToolTree />
        </div>
        <Component className="max-w-1/2" {...pageProps} />
      </ThemeProvider>
    </main>
  )
}
