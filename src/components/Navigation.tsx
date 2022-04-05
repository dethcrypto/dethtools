import { useEffect, useState } from 'react';

import { BurgerIcon } from './icons/BurgerIcon';
import { DethToolsLogo } from './icons/DethToolsLogo';
import { DiscordIcon } from './icons/DiscordIcon';
import { GithubIcon } from './icons/GithubIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { Logo } from './Logo';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowSize;
}

export function Navigation({
  handleShowMobileTree,
}: {
  handleShowMobileTree: (width: number) => void;
}) {
  const { width } = useWindowSize();

  useEffect(() => {
    handleShowMobileTree(width);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  return (
    <nav className="mx-auto flex h-20 items-center justify-between px-8 pt-6 pb-4 sm:px-0">
      <section className="flex cursor-pointer items-center gap-4">
        <Logo width={36} height={36} />
        {width > 480 && <DethToolsLogo width={164} height={164} />}
        <p> WIP </p>
      </section>

      <section className="flex items-center">
        {width > 480 ? (
          <section className="flex">
            <a
              href="https://github.com/dethcrypto/dethtools"
              className="-my-2 p-2 text-gray-400 hover:text-gray-200"
              aria-label="GitHub"
            >
              <GithubIcon width={26} height={26} />
            </a>
            <a
              href="https://twitter.com/dethcrypto"
              className="-my-2 p-2 text-gray-400 hover:text-gray-200"
              aria-label="Twitter"
            >
              <TwitterIcon width={26} height={26} />
            </a>
            <a
              href="https://discord.gg/ATcDz5xEY6"
              className="-my-2 p-2 text-gray-400 hover:text-gray-200"
              aria-label="Discord"
            >
              <DiscordIcon width={26} height={26} />
            </a>
          </section>
        ) : (
          <BurgerIcon
            width={36}
            height={36}
            onClick={() => handleShowMobileTree(width)}
            // alt="mobile burger menu" <-- TODO
          />
        )}
      </section>
    </nav>
  );
}
