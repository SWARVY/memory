import type { PropsWithChildren } from 'react';
import { Link } from 'react-router';
import buildPath from '~/shared/lib/build-path';
import { cn } from '~/shared/lib/utils';
import { GridBackground } from '~/shared/ui/grid-background';
import { ArchiveIcon, CompassIcon, GithubIcon } from '~/shared/ui/icon';
import { LinkPreview } from '~/shared/ui/link-preview';
import { PointerHighlight } from '~/shared/ui/pointer-highlight';

interface StatusPingProps extends PropsWithChildren {
  status: 'active' | 'inactive';
}

export default function Land() {
  return (
    <GridBackground>
      <div className="z-10 flex size-full flex-col items-center justify-center gap-y-24">
        <div className="text-6xl font-bold">
          <span className="text-7xl">Greetings,</span>
          <PointerHighlight
            rectangleClassName="bg-neutral-200 opacity-70 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
            pointerClassName="text-yellow-500 size-5"
          >
            <span className="relative z-10">forimaginary.dev</span>
          </PointerHighlight>
        </div>
        <div className="flex items-center gap-x-16">
          <LinkPreview url="https://caffhheiene.vercel.app">
            <StatusPing status="inactive">
              <ArchiveIcon size={36} />
            </StatusPing>
          </LinkPreview>
          <Link to={buildPath('/archive/list')}>
            <StatusPing status="active">
              <CompassIcon size={36} />
            </StatusPing>
          </Link>
          <LinkPreview url="https://github.com/SWARVY">
            <StatusPing status="active">
              <GithubIcon size={36} />
            </StatusPing>
          </LinkPreview>
        </div>
      </div>
    </GridBackground>
  );
}

function StatusPing({ status, children }: StatusPingProps) {
  return (
    <div className="relative">
      <span className="absolute -top-2 -left-2 flex size-3">
        <span
          className={cn(
            'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
            {
              'bg-green-400': status === 'active',
              'bg-red-400': status === 'inactive',
            },
          )}
        />
        <span
          className={cn('relative inline-flex size-3 rounded-full', {
            'bg-green-500': status === 'active',
            'bg-red-500': status === 'inactive',
          })}
        />
      </span>
      {children}
    </div>
  );
}
