import { Skeleton } from "./Skeleton";

export function OrderSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
  );
}
