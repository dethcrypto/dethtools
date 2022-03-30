import { useEffect, useState } from 'react';

import BurgerSvg from '../../public/static/svg/burger';
import DethToolsSvg from '../../public/static/svg/deth-tools';
import DiscordSvg from '../../public/static/svg/discord';
import GithubSvg from '../../public/static/svg/github';
import LogoSvg from '../../public/static/svg/logo';
import TwitterSvg from '../../public/static/svg/twitter';

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
        <LogoSvg width={36} height={36} alt="deth tools logo" />
        {width > 480 && (
          <DethToolsSvg width={164} height={164} alt="deth tools logo text" />
        )}
        <p> WIP </p>
      </section>

      <section className="flex items-center gap-4">
        {width > 480 ? (
          <section className="flex gap-3">
            <GithubSvg width={26} height={26} alt="github icon" />
            <TwitterSvg width={26} height={26} alt="twitter icon" />
            <DiscordSvg width={26} height={26} alt="discord icon" />
          </section>
        ) : (
          <BurgerSvg
            width={36}
            height={36}
            onClick={() => handleShowMobileTree(width)}
            alt="mobile burger menu"
          />
        )}
      </section>
    </nav>
  );
}
