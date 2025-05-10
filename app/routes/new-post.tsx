import { Protect } from '@clerk/react-router';
import { Navigate } from 'react-router';
import { PostWriter } from '~/features/post';

export default function NewPost() {
  return (
    <Protect fallback={<Navigate to="/" />}>
      <PostWriter />
    </Protect>
  );
}
