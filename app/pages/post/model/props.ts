import type { PostResponse, PostSummary } from 'convex/schema';

export interface PostWriterProps {
  defaultValues?: PostResponse;
}

export interface PostDetailProps {
  postId: string;
}

export interface AdjacentPostLinksProps {
  previousPost: PostSummary | null;
  nextPost: PostSummary | null;
}

export interface AdjacentPostLinkProps {
  type: 'previous' | 'next';
  postId?: string;
  label?: string;
}
