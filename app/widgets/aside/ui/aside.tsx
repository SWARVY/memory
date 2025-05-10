import { SignInButton, SignOutButton, useAuth } from '@clerk/react-router';
import {
  ChevronRight,
  Github,
  Instagram,
  Lock,
  LockOpen,
  Mail,
  Pencil,
  Sun,
} from 'lucide-react';
import { Link, NavLink } from 'react-router';
import buildPath from '~/shared/lib/build-path';
import { cn } from '~/shared/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '~/shared/ui/avatar';
import { Button } from '~/shared/ui/button';

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
  const { isSignedIn } = useAuth();

  return (
    <article className="flex w-full flex-col justify-center space-y-4">
      <Link to={buildPath('/')}>
        <Avatar className="size-24">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Link>
      <div className="space-y-2 text-sm text-stone-600">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">사용자 이름</h2>
          <div className="flex items-center gap-x-2">
            {isSignedIn ? (
              <>
                <NavLink to={buildPath('/new-post')}>
                  <Button variant="ghost" className="size-8 [&_svg]:size-12">
                    <Pencil />
                  </Button>
                </NavLink>
                <SignOutButton>
                  <Button variant="ghost" className="size-8 [&_svg]:size-12">
                    <LockOpen />
                  </Button>
                </SignOutButton>
              </>
            ) : (
              <SignInButton mode="modal">
                <Button variant="ghost" className="size-8 [&_svg]:size-12">
                  <Lock />
                </Button>
              </SignInButton>
            )}
            <Button variant="ghost" className="size-8 [&_svg]:size-12">
              <Sun />
            </Button>
          </div>
        </div>
        <p className="text-stone-500">소개글이 들어갈 자리입니다.</p>
      </div>
    </article>
  );
}

function LinkSection() {
  return (
    <div className="flex flex-col gap-y-6">
      <ul className="space-y-4">
        <AsideNavLink to={buildPath('/archive/list')} description="ARCHIVE" />
        <AsideNavLink to={buildPath('/about')} description="ABOUT" />
      </ul>
      <div className="flex gap-2">
        <AsideSnsLink icon={<Github />} href="https://github.com/SWARVY" />
        <AsideSnsLink
          icon={<Instagram />}
          href="https://www.instagram.com/caffhheine"
        />
        <AsideSnsLink icon={<Mail />} href="mailto:swarvy0826@naver.com" />
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
