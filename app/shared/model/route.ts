export const Routes = {
  ROOT: '/',
  NEW_POST: '/new-post',
  ARCHIVE_LIST: '/archive/list',
  ARCHIVE_DETAIL: '/archive/:postId',
  ABOUT: '/about',
  SETTINGS: '/settings',
} as const;

export type Routes = (typeof Routes)[keyof typeof Routes];
