import { Protect } from '@clerk/react-router';
import { Navigate } from 'react-router';
import { PostWriter } from '~/pages/post';

export default function NewPostPage() {
  return (
    <Protect fallback={<Navigate to="/" />}>
      <PostWriter />
    </Protect>
  );
}
