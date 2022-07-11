import { ReactElement, useState } from 'react';

import { LightbulbIcon } from '../icons/LighbulbIcon';

function getRandomIntInclusive(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseRandom<T>(xs: T[]): T {
  return xs[getRandomIntInclusive(0, xs.length - 1)];
}

export interface TipsProps {
  texts: string[];
}

export function Tips({ texts }: TipsProps): ReactElement {
  const [state, setState] = useState<string>(() => chooseRandom(texts));

  return (
    <section className="mt-10 w-full">
      <output
        className="flex cursor-pointer items-center gap-3 rounded-md p-3 text-gray-400 duration-200 hover:bg-gray-600 active:scale-95 active:bg-gray-700"
        onClick={() => setState(chooseRandom(texts))}
      >
        <div>
          <LightbulbIcon className="animate-pulse" />
        </div>
        <p className="select-none">{state}</p>
      </output>
    </section>
  );
}
