import { ReactElement } from 'react';

import { Bug } from './icons/BugIcon';
import { DiscordIcon } from './icons/DiscordIcon';
import { GithubIcon } from './icons/GithubIcon';
import { TwitterIcon } from './icons/TwitterIcon';

type NavigationSocialProps = React.ComponentPropsWithoutRef<'div'>;

export function NavigationSocial({
  ...props
}: NavigationSocialProps): ReactElement {
  return (
    <div className="hidden items-center sm:flex" {...props}>
      <SocialIcons />
      <a
        className="ml-6 flex items-center gap-3 rounded-md border border-gray-300 
        px-4 py-2 duration-200 hover:bg-gray-700 active:scale-95"
        href="https://github.com/dethcrypto/dethtools/issues"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Bug height={14} width={14} />
        Report bug
      </a>
    </div>
  );
}

// @internal
function SocialIcons(): ReactElement {
  return (
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
  );
}
