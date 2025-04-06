import type { Doc } from 'convex/_generated/dataModel';
import type { PostType } from 'convex/schema';
import { Suspense } from 'react';
import { SuspenseQuery } from '@suspensive/react-query';
import { convexQuery } from '@convex-dev/react-query';
import { api } from 'convex/_generated/api';

interface PostListProps {
  type: PostType;
}

interface PostItemProps {
  post: Doc<'post'>;
}

export default function PostList({ type }: PostListProps) {
  return (
    <Suspense>
      <SuspenseQuery {...convexQuery(api.posts.getPosts, { type })}>
        {({ data }) => (
          <ul>
            {data.map((post) => (
              <li key={post._id}>
                <PostListItem post={post} />
              </li>
            ))}
          </ul>
        )}
      </SuspenseQuery>
    </Suspense>
  );
}

function PostListItem({ post }: PostItemProps) {
  return (
    <div>
      <h2>{post.title}</h2>
    </div>
  );
}
