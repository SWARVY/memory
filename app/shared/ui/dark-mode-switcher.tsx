import { ClientOnly } from '@suspensive/react';
import { type ComponentProps, Suspense } from 'react';

import useDarkMode from '../lib/use-dark-mode';
import { cn } from '../lib/utils';
import { MoonIcon, SunIcon } from './icon';
import { Spinner } from './spinner';

interface DarkModeSwitcherProps extends ComponentProps<'button'> {
  size?: number;
}

function DarkModeSwitcherContainer({
  size = 16,
  className,
  onClick,
  ...props
}: DarkModeSwitcherProps) {
  return (
    <Suspense fallback={<Spinner />}>
      <ClientOnly>
        <DarkModeSwitcherContent
          size={size}
          className={className}
          onClick={onClick}
          {...props}
        />
      </ClientOnly>
    </Suspense>
  );
}

function DarkModeSwitcherContent({
  size = 28,
  className,
  onClick,
  ...props
}: DarkModeSwitcherProps) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={(e) => {
        toggleDarkMode();
        onClick?.(e);
      }}
      className={cn(
        'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none',
        'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        className,
      )}
      {...props}
    >
      {isDarkMode ? <MoonIcon size={size} /> : <SunIcon size={size} />}
    </button>
  );
}

export { DarkModeSwitcherContainer as DarkModeSwitcher };
