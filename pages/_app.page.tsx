import '/css/globals.css'

import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { useState } from 'react'

import { Navigation } from '../components/Navigation'
import { ToolTree } from '../components/ToolTree'

export default function MyApp({ Component, pageProps }: AppProps) {
  const [isShowMobileTree, setIsShowMobileTree] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  function handleShowMobileTree(width: number) {
    setIsShowMobileTree(!isShowMobileTree)
    if (width >= 480) {
      setIsMobile(false)
    } else {
      setIsMobile(true)
    }
  }

  return (
    <main className="prose mx-auto mt-12 h-full max-w-4xl">
      <ThemeProvider attribute="class" defaultTheme="light">
        <Navigation handleShowMobileTree={handleShowMobileTree} />
        <div className="mt-6 flex min-h-full max-w-6xl gap-12 rounded-md bg-deth-gray-700 p-12 align-top">
          <ToolTree isShowMobileTree={isShowMobileTree} isMobile={isMobile} />
          <Component className="max-w-1/2 " {...pageProps} />
        </div>
      </ThemeProvider>
    </main>
  )
}
