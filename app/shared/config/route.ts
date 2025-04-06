export const Routes = {
  ROOT: '/',
  NEW_POST: '/new-post',
  ARCHIVE: '/archive',
  ABOUT: '/about',
  TEST: '/test',
} as const;

export type Routes = (typeof Routes)[keyof typeof Routes];
