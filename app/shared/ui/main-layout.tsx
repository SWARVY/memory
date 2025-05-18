import type { PropsWithChildren, ReactNode } from 'react';

import { cn } from '../lib/utils';

export interface MainLayoutProps extends PropsWithChildren {
  aside: ReactNode;
  showAside?: boolean;
  shouldRestrictArea?: boolean;
}

export function MainLayout({
  aside,
  children,
  showAside = true,
  shouldRestrictArea = false,
}: MainLayoutProps) {
  return (
    <div className="size-full min-h-screen">
      <main
        className={cn(
          'mx-auto flex size-full min-h-screen max-w-5xl gap-4',
          'flex-col lg:flex-row',
          shouldRestrictArea ? 'max-w-5xl p-3 xl:p-10' : '',
        )}
      >
        {showAside && <div className="w-full shrink-0 lg:w-72">{aside}</div>}
        <div className="h-full flex-1">{children}</div>
      </main>
    </div>
  );
}
