import type { PropsWithChildren, ReactNode } from 'react';

import { cn } from '../lib/utils';

export interface MainLayoutProps extends PropsWithChildren {
  aside: ReactNode;
  showAside?: boolean;
}

export function MainLayout({
  aside,
  children,
  showAside = true,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-start p-10">
      <main
        className={cn(
          'flex size-full max-w-5xl flex-1 grow gap-4',
          'flex-col px-4 lg:flex-row',
        )}
      >
        {showAside && <div className="w-full shrink-0 lg:w-72">{aside}</div>}
        <div className="min-h-full w-full flex-1 grow">{children}</div>
      </main>
    </div>
  );
}
