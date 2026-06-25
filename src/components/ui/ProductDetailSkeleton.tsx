import { Skeleton } from "./Skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Skeleton className="mb-8 h-4 w-24" />
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <Skeleton className="h-[400px] w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="mt-6 h-20 w-full" />
          <Skeleton className="mt-8 h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
