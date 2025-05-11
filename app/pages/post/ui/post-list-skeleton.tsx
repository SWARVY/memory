import { Skeleton } from '~/shared/ui/skeleton';

export default function PostListSkeleton() {
  return (
    <div className="flex h-full flex-col justify-between">
      <ul className="space-y-4 pb-4">
        <PostListItemSkeleton />
        <PostListItemSkeleton />
        <PostListItemSkeleton />
        <PostListItemSkeleton />
      </ul>
    </div>
  );
}

function PostListItemSkeleton() {
  return (
    <li className="space-y-4 py-6 pl-9">
      <div className="space-y-2">
        <Skeleton className="h-5 w-[10rem]" />
        <Skeleton className="h-9 w-[15rem]" />
      </div>
      <Skeleton className="h-10 w-full" />
    </li>
  );
}
