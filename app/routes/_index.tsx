import { Land } from '~/pages/land';

import type { Route } from '../+types/root';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'forimaginary.dev' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Root() {
  return <Land />;
}
