import Image from 'next/image';
import { useEffect, useState } from 'react';

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
        <Image
          className=""
          src="/static/svg/logo.svg"
          width={36}
          height={36}
          alt="deth tools logo"
        />
        {width > 480 && (
          <Image
            className=""
            src="/static/svg/deth-tools.svg"
            width={164}
            height={164}
            alt="deth tools logo"
          />
        )}
        <p> WIP </p>
      </section>

      <section className="flex items-center gap-4">
        {width > 480 ? (
          <section className="flex gap-3">
            <Image
              className="cursor-pointer"
              src="/static/svg/github.svg"
              width={26}
              height={26}
              alt="deth tools github logo"
            />
            <Image
              className="cursor-pointer"
              src="/static/svg/twitter.svg"
              width={26}
              height={26}
              alt="deth tools github logo"
            />
            <Image
              className="cursor-pointer"
              src="/static/svg/discord.svg"
              width={26}
              height={26}
              alt="deth tools github logo"
            />
          </section>
        ) : (
          <Image
            className="cursor-pointer"
            src="/static/svg/burger.svg"
            width={36}
            height={36}
            onClick={() => handleShowMobileTree(width)}
            alt="deth tools github logo"
          />
        )}
      </section>
    </nav>
  );
}
