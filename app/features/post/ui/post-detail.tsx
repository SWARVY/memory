import { useAuth } from '@clerk/clerk-react';
import { convexQuery } from '@convex-dev/react-query';
import { SuspenseQuery } from '@suspensive/react-query';
import { api } from 'convex/_generated/api';
import type { Id } from 'convex/_generated/dataModel';
import { format } from 'date-fns';
import { SquarePen } from 'lucide-react';
import { Suspense } from 'react';
import { Link } from 'react-router';
import buildPath from '~/shared/lib/build-path';
import { Button } from '~/shared/ui/button';

import useBlocksFromHTML from '../hooks/use-blocks-from-html';
import Editor from './post-editor';

interface PostDetailProps {
  postId: string;
}

export default function PostDetail({ postId }: PostDetailProps) {
  const { isSignedIn } = useAuth();

  return (
    <div className="flex size-full flex-col items-center justify-start">
      <nav className="fixed top-10 left-10 flex h-12 w-full justify-start gap-x-2">
        {isSignedIn && (
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            size="icon"
          >
            <SquarePen />
          </Button>
        )}
        <Link to={buildPath('/archive/list')}>
          <Button type="button" variant="outline" className="rounded-full">
            All ARTICLES
          </Button>
        </Link>
      </nav>
      <Suspense>
        <SuspenseQuery
          {...convexQuery(api.posts.getPostDetail, {
            id: postId as Id<'post'>,
          })}
        >
          {({ data }) =>
            data &&
            data.contents && (
              <div className="mt-8 flex w-full max-w-2xl flex-col gap-y-12">
                <div className="space-y-2 text-center lg:px-20">
                  <h1 className="text-center text-5xl font-semibold break-keep">
                    {data.title}
                  </h1>
                  <div className="flex w-full justify-center gap-x-2 text-center text-sm text-stone-500">
                    <p>
                      <time>{format(data._creationTime, 'PPP')}</time>
                      <span className="mx-1">·</span>
                      {data.category}
                    </p>
                  </div>
                </div>
                <PostDetailContent contents={data.contents} />
                <hr />
              </div>
            )
          }
        </SuspenseQuery>
      </Suspense>
    </div>
  );
}

function PostDetailContent({ contents }: { contents: string }) {
  const blocks = useBlocksFromHTML(contents);

  return <Editor initialContent={blocks} editable={false} />;
}
