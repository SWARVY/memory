import { LockIcon, SunIcon } from 'lucide-react';
import { cn } from '~/shared/lib/utils';
import { Button } from '~/shared/ui/button';
import Hero from './hero';

export default function Navigator() {
  return (
    <Hero>
      <nav
        className={cn(
          'sticky top-0 flex items-center justify-between',
          'w-full h-fit max-w-5xl rounded-b-xl p-5 shadow-2xl',
          'bg-white',
        )}
      >
        <h1 className="text-xl font-bold">Memory</h1>
        <div className="flex gap-x-2">
          <Button type="button" variant="ghost">
            Home
          </Button>
          <Button type="button" variant="ghost">
            Archive
          </Button>
          <Button type="button" variant="ghost">
            About
          </Button>
          <Button type="button" variant="ghost">
            Github
          </Button>
        </div>
        <div className="flex gap-x-2">
          <Button type="button" variant="ghost">
            <LockIcon />
          </Button>
          <Button type="button" variant="ghost">
            <SunIcon />
          </Button>
        </div>
      </nav>
    </Hero>
  );
}
