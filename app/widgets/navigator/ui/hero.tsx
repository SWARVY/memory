import type { PropsWithChildren } from 'react';
import { cn } from '~/shared/lib/utils';

export default function Hero({ children }: PropsWithChildren) {
  return (
    <header
      className={cn(
        'relative flex justify-center ',
        'transition-all size-full max-h-2/5 lg:max-h-3/5',
        'bg-gray-200 ',
      )}
    >
      {children}
    </header>
  );
}
