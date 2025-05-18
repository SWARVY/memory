import { redirect, useParams } from 'react-router';
import { PostDetail } from '~/pages/post';
import buildPath from '~/shared/lib/build-path';

export default function ArchiveDetailPage() {
  const { postId } = useParams();

  return postId ? (
    <div className="flex size-full flex-col items-center justify-start">
      <PostDetail postId={postId} />
    </div>
  ) : (
    redirect(buildPath('/archive/list'))
  );
}
