import { Skeleton } from "./Skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <Skeleton className="mb-4 h-40 w-full rounded-lg" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="mb-1 h-3 w-1/2" />
      <Skeleton className="mt-3 h-5 w-1/3" />
    </div>
  );
}
