import { ReactElement } from 'react';

export interface HeaderProps {
  icon: React.ReactNode;
  text: string[];
}

export function Header({ icon, text }: HeaderProps): ReactElement {
  const dir = text.slice(0, -1);
  const last = text[text.length - 1];

  return (
    <header className="mb-8 flex flex-wrap items-center gap-3 align-middle md:mb-11">
      {icon}
      {dir.map((str, i) => (
        <span
          key={i}
          className="inline-flex gap-1 whitespace-nowrap text-xl text-gray-300"
        >
          {str} <p className="hidden sm:block">/</p>
        </span>
      ))}
      <h3 className="whitespace-nowrap text-2xl text-pink">{last}</h3>
    </header>
  );
}
