import { convexQuery } from '@convex-dev/react-query';
import { SuspenseQuery } from '@suspensive/react-query';
import { api } from 'convex/_generated/api';
import type { Doc } from 'convex/_generated/dataModel';
import { format } from 'date-fns';
import { ChevronRight } from 'lucide-react';
import { Suspense } from 'react';
import { Link } from 'react-router';
import buildPath from '~/shared/lib/build-path';
import { Button } from '~/shared/ui/button';

import PostPagination from './post-pagination';

interface PostItemProps {
  post: Doc<'summary'>;
}

export default function PostList() {
  return (
    <Suspense>
      <SuspenseQuery
        {...convexQuery(api.posts.getPosts, {
          cursor: null,
          numItems: 10,
        })}
      >
        {({ data: { page, isDone, continueCursor } }) => (
          <div className="flex size-full min-h-0 flex-col justify-between">
            <ul className="space-y-4">
              {page.map((post) => (
                <li key={`post-${post._id}`}>
                  <PostListItem post={post} />
                </li>
              ))}
            </ul>
            <PostPagination continueCursor={continueCursor} isDone={isDone} />
          </div>
        )}
      </SuspenseQuery>
    </Suspense>
  );
}

function PostListItem({ post }: PostItemProps) {
  const { _creationTime, postId, title, category, briefContents } = post;

  return (
    <div className="flex size-full items-stretch justify-between gap-x-2">
      <div className="flex-1 space-y-4 py-6 pl-9">
        <div className="relative flex flex-col items-start gap-y-2">
          <div className="flex items-center gap-x-4 text-sm">
            <time>{format(_creationTime, 'PPP').toUpperCase()}</time>
            <Link
              to={buildPath('/')}
              className="font-semibold transition-colors hover:text-stone-500"
            >
              {category}
            </Link>
          </div>
          <Link
            to={buildPath('/archive/:postId', { postId })}
            className="group flex items-center gap-x-1"
          >
            <h3 className="text-3xl font-bold transition-colors group-hover:text-stone-500">
              {title}
            </h3>
            <ChevronRight className="text-stone-500 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        </div>
        <p className="text-sm text-stone-500">{briefContents}</p>
      </div>
      <Link
        to={buildPath('/archive/:postId', { postId })}
        className="flex w-full max-w-16 py-3 pr-3"
      >
        <Button type="button" className="size-full rounded-xl">
          <ChevronRight className="size-6" />
        </Button>
      </Link>
    </div>
  );
}
