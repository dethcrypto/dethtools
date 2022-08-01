import Head from 'next/head';
import { ReactElement } from 'react';

export default function Home(): ReactElement {
  return (
    <div>
      <Head>
        <title>Deth tools</title>
        <meta
          name="description"
          content="A handy toolset for every ethereum developer"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}
