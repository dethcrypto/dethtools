import { useState } from 'react';

import BulbSvg from '../../public/static/svg/bulb';

type TipCategory = 'general' | 'calculator' | 'decoder';

const tips: { [key in TipCategory]: string[] } = {
  general: ['General tip #0', 'General tip #1', 'General tip #2'],
  calculator: [
    'Did you know you can paste hex (0x...) values directly into the inputs?',
    'Test tip #2',
    'Test tip #3',
  ],
  decoder: ['Decoder tip #0', 'Decoder tip #1'],
};

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function Tips({ tipType }: { tipType?: TipCategory }) {
  const [state, setState] = useState<string>(() => {
    return generateTip(tipType || '');
  });

  function generateTip(tipType: string): string {
    switch (tipType) {
      case 'calculator':
        return tips.calculator[
          getRandomIntInclusive(0, tips.general.length - 1)
        ];
      default:
        return tips.general[getRandomIntInclusive(0, tips.general.length - 1)];
    }
  }

  return (
    <section className="mt-10 w-full max-w-xs">
      <output
        className="flex cursor-pointer items-center gap-3 rounded-md p-3 text-gray-400 duration-200 hover:bg-gray-600 active:scale-95 active:bg-gray-700"
        onClick={() => setState(generateTip(tipType || ''))}
      >
        <div>
          <BulbSvg className="animate-pulse" />
        </div>
        <p className="select-none">{state}</p>
      </output>
    </section>
  );
}
