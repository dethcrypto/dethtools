import { useEffect, useState } from 'react';

import BulbSvg from '../../public/static/svg/bulb';

type TipCategory = 'general' | 'eth-unit-conversion';

const tips = {
  general: ['General tip #1'],
  'eth-unit-conversion': [
    'Did you know you can paste hex (0x...) values directly into the inputs?',
    'Eth tip #2',
  ],
};

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function Tips() {
  const [state, setState] = useState('');

  function generateTip() {
    const href = typeof window !== 'undefined' && window.location.pathname;

    let tipCategory: TipCategory | string = 'general';
    if (typeof href === 'string') tipCategory = href.substring(1);

    switch (tipCategory) {
      case 'eth-unit-conversion':
        setState(
          tips['eth-unit-conversion'][
            getRandomIntInclusive(0, tips.general.length - 1)
          ],
        );
        break;
      default:
        setState(
          tips.general[getRandomIntInclusive(0, tips.general.length - 1)],
        );
    }
  }

  useEffect(generateTip, []);

  return (
    <section className="my-6 w-full max-w-sm py-3 px-4">
      <output className="flex items-center gap-2 text-gray-400">
        <div>
          <BulbSvg className="animate-pulse" />
        </div>
        {state}
      </output>
    </section>
  );
}
