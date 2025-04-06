import { PostList } from '~/features/post';
import type { Route } from '../+types/root';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Root() {
  return (
    <div>
      <PostList type="POST" />
    </div>
  );
}
