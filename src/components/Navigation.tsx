import { ReactElement } from 'react';

import { DethToolsLogo } from './icons/DethToolsLogo';
import { HamburgerIcon } from './icons/HamburgerIcon';
import { Logo } from './Logo';
import { NavigationSocial } from './NavigationSocial';

interface NavigationProps {
  useState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export function Navigation({ useState }: NavigationProps): ReactElement {
  const [showMobileTree, setShowMobileTree] = useState;

  return (
    <nav className="mx-auto flex h-20 items-center justify-between px-8 pt-6 pb-4 sm:px-0">
      <section className="flex cursor-pointer items-center gap-4">
        <Logo width={36} height={36} />
        <DethToolsLogo width={164} height={164} />
      </section>
      <section className="flex items-center">
        <NavigationSocial className="hidden items-center sm:flex" />
        <button
          onClick={() => setShowMobileTree(!showMobileTree)}
          className="block sm:hidden"
          aria-label="menu"
        >
          <HamburgerIcon width={36} height={36} />
        </button>
      </section>
    </nav>
  );
}
