import { generatePath } from 'react-router';

import type { Routes } from '../model/route';

export default function buildPath<P extends Routes>(
  ...args: Parameters<typeof generatePath<P>>
): string {
  return generatePath(...args);
}
