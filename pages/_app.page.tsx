import '../src/globals.css';

import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';

import { Navigation } from '../src/components/Navigation';
import { ToolTree } from '../src/components/ToolTree';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className="mx-auto max-w-4xl">
      <ThemeProvider attribute="class" defaultTheme="light">
        <Navigation />
        <div className="mt-28 flex max-w-6xl gap-12 align-top">
          <ToolTree />
          <Component className="max-w-1/2" {...pageProps} />
        </div>
      </ThemeProvider>
    </main>
  );
}
