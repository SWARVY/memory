import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from '@clerk/react-router';
import { convexQuery } from '@convex-dev/react-query';
import { SuspenseQuery } from '@suspensive/react-query';
import { api } from 'convex/_generated/api';
import { ChevronRight } from 'lucide-react';
import { Suspense } from 'react';
import { Link, NavLink } from 'react-router';
import buildPath from '~/shared/lib/build-path';
import { cn } from '~/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '~/shared/ui/avatar';
import { Button } from '~/shared/ui/button';
import { DarkModeSwitcher } from '~/shared/ui/dark-mode-switcher';
import {
  AtSignIcon,
  FingerprintIcon,
  GithubIcon,
  InstagramIcon,
  LogoutIcon,
} from '~/shared/ui/icon';
import { Skeleton } from '~/shared/ui/skeleton';

export default function Aside() {
  return (
    <aside className="w-full space-y-6 border-stone-200 p-4 lg:border-r">
      <ProfileSection />
      <LinkSection />
      <div className="text-sm font-light text-stone-600">
        © SWARVY. All Rights Reserved.
      </div>
    </aside>
  );
}

function ProfileSection() {
  return (
    <article className="flex w-full flex-col justify-center space-y-4">
      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="size-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          </div>
        }
      >
        <SuspenseQuery {...convexQuery(api.settings.getSettings, {})}>
          {({ data }) => (
            <>
              <Link to={buildPath('/')}>
                <Avatar className="size-24">
                  <AvatarImage
                    className="object-cover"
                    src={data?.profileImage ?? 'https://github.com/shadcn.png'}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div className="space-y-2 text-sm text-stone-600">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    {data?.name ?? '사용자 이름'}
                  </h2>
                  <div className="flex items-center gap-x-2">
                    <SignedIn>
                      <SignOutButton>
                        <button
                          className={cn(
                            'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none',
                            'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
                          )}
                        >
                          <LogoutIcon size={16} />
                        </button>
                      </SignOutButton>
                    </SignedIn>
                    <SignedOut>
                      <SignInButton mode="modal">
                        <button
                          className={cn(
                            'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none',
                            'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
                          )}
                        >
                          <FingerprintIcon size={16} />
                        </button>
                      </SignInButton>
                    </SignedOut>
                    <DarkModeSwitcher />
                  </div>
                </div>
                <p className="text-stone-500 dark:text-stone-300">
                  {data?.description
                    ? data.description
                    : '소개글이 들어갈 자리입니다.'}
                </p>
              </div>
            </>
          )}
        </SuspenseQuery>
      </Suspense>
    </article>
  );
}

function LinkSection() {
  return (
    <div className="flex flex-col gap-y-6">
      <ul className="space-y-4">
        <AsideNavLink to={buildPath('/archive/list')} description="ARCHIVE" />
        <AsideNavLink to={buildPath('/about')} description="ABOUT" />
        <SignedIn>
          <hr />
          <AsideNavLink to={buildPath('/new-post')} description="NEW POST" />
          <AsideNavLink to={buildPath('/settings')} description="SETTINGS" />
        </SignedIn>
      </ul>
      <div className="flex gap-2">
        <AsideSnsLink icon={<GithubIcon />} href="https://github.com/SWARVY" />
        <AsideSnsLink
          icon={<InstagramIcon />}
          href="https://www.instagram.com/caffhheine"
        />
        <AsideSnsLink
          icon={<AtSignIcon />}
          href="mailto:swarvy0826@naver.com"
        />
      </div>
    </div>
  );
}

function AsideNavLink({
  to,
  description,
}: {
  to: string;
  description: string;
}) {
  return (
    <li className="group flex items-center justify-between text-sm [&_svg]:size-4">
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn('transition-all', isActive ? 'font-semibold' : '')
        }
      >
        {description}
      </NavLink>
      <ChevronRight className="opacity-0 transition-opacity group-hover:opacity-100" />
    </li>
  );
}

function AsideSnsLink({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Button
        variant="outline"
        className="rounded-full [&_svg]:size-12"
        size="icon"
      >
        {icon}
      </Button>
    </a>
  );
}
