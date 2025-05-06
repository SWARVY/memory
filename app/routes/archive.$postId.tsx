import { redirect, useParams } from 'react-router';
import { PostDetail } from '~/features/post';
import buildPath from '~/shared/lib/build-path';

export default function ArchiveDetail() {
  const { postId } = useParams();

  return postId ? (
    <div className="flex size-full flex-col items-center justify-start">
      <PostDetail postId={postId} />
    </div>
  ) : (
    redirect(buildPath('/'))
  );
}
