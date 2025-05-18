import { SignedIn } from '@clerk/clerk-react';
import { convexQuery } from '@convex-dev/react-query';
import Giscus from '@giscus/react';
import { SuspenseQuery } from '@suspensive/react-query';
import { api } from 'convex/_generated/api';
import type { Id } from 'convex/_generated/dataModel';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, SquarePen, X } from 'lucide-react';
import { Suspense, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Editor } from '~/features/editor';
import buildPath from '~/shared/lib/build-path';
import { cn } from '~/shared/lib/utils';
import { Button } from '~/shared/ui/button';
import { DarkModeSwitcher } from '~/shared/ui/dark-mode-switcher';

import type {
  AdjacentPostLinkProps,
  AdjacentPostLinksProps,
  PostDetailProps,
} from '../model/props';
import PostEditor from './post-editor';

export default function PostDetail({ postId }: PostDetailProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="relative size-full">
      <nav className="sticky top-0 z-10 flex h-auto justify-start gap-x-2 bg-transparent p-4">
        <SignedIn>
          <Button
            type="button"
            variant={isEditing ? 'destructive' : 'outline'}
            className="rounded-full"
            size="icon"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? <X /> : <SquarePen />}
          </Button>
        </SignedIn>
        <Link to={buildPath('/archive/list')}>
          <Button type="button" variant="outline" className="rounded-full">
            ALL ARTICLES
          </Button>
        </Link>
        <DarkModeSwitcher className="size-9 rounded-full border bg-white shadow-xs dark:bg-stone-900" />
      </nav>
      <div className="h-[calc(100%-3rem)] px-4">
        <Suspense>
          <SuspenseQuery
            {...convexQuery(api.posts.getPostDetail, {
              id: postId as Id<'post'>,
            })}
          >
            {({ data }) => {
              if (!data) {
                return null;
              }

              const { currentPost, previousPost, nextPost } = data;
              const blocks = JSON.parse(currentPost.contents);

              return !isEditing ? (
                <div className="mx-auto mt-20 flex max-w-3xl flex-col gap-y-12">
                  <div className="space-y-4 text-center xl:px-20">
                    <h1 className="text-center text-4xl font-semibold break-keep">
                      {currentPost.title}
                    </h1>
                    <div className="flex w-full justify-center gap-x-2 text-center text-sm text-stone-500 dark:text-stone-300">
                      <p>
                        <time>{format(currentPost._creationTime, 'PPP')}</time>
                        <span className="mx-1">·</span>
                        {currentPost.category}
                      </p>
                    </div>
                  </div>
                  <hr />
                  <Editor initialContent={blocks} editable={false} />
                  <AdjacentPostLinks
                    previousPost={previousPost}
                    nextPost={nextPost}
                  />
                  <hr />
                  <Giscus
                    id="comments"
                    repo="SWARVY/memory"
                    repoId="R_kgDOOUWZGA"
                    category="Announcements"
                    categoryId="DIC_kwDOOUWZGM4Cp_tD"
                    mapping="pathname"
                    reactionsEnabled="1"
                    emitMetadata="0"
                    inputPosition="bottom"
                    theme="catppuccin_latte"
                    lang="en"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="w-full">
                  <PostEditor defaultValues={currentPost} />
                </div>
              );
            }}
          </SuspenseQuery>
        </Suspense>
      </div>
    </div>
  );
}

function AdjacentPostLinks({ previousPost, nextPost }: AdjacentPostLinksProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
      <AdjacentPostLink
        type="previous"
        postId={previousPost?.postId}
        label={previousPost?.title}
      />
      <AdjacentPostLink
        type="next"
        postId={nextPost?.postId}
        label={nextPost?.title}
      />
    </div>
  );
}

function AdjacentPostLink({ type, postId, label }: AdjacentPostLinkProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!postId) {
      return;
    }

    navigate(buildPath('/archive/:postId', { postId }));
  };

  return (
    <button
      type="button"
      className={cn(
        'flex items-center gap-x-2 rounded-lg border px-4 py-3 text-sm text-stone-500 transition-colors dark:text-stone-300 [&_svg]:size-4',
        'hover:bg-stone-50 hover:text-stone-950',
        type === 'previous' ? 'justify-start' : 'justify-end',
        postId ? 'cursor-pointer' : 'cursor-not-allowed',
      )}
      onClick={handleClick}
    >
      {postId && (
        <div className={cn(type === 'previous' ? 'order-1' : 'order-2')}>
          {type === 'previous' ? <ChevronLeft /> : <ChevronRight />}
        </div>
      )}
      <p
        className={cn(
          'line-clamp-1',
          type === 'previous' ? 'order-2' : 'order-1',
        )}
      >
        {label
          ? label
          : type === 'previous'
            ? '이전 포스트가 없습니다'
            : '다음 포스트가 없습니다'}
      </p>
    </button>
  );
}
