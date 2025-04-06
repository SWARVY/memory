import { lazy, Suspense } from 'react';

const PostWriter = lazy(() => import('~/features/post/ui/post-writer'));

export default function NewPost() {
  return (
    <div>
      <Suspense>
        <PostWriter />
      </Suspense>
    </div>
  );
}
