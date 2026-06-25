import { Skeleton } from "./Skeleton";

export function ConfirmacionSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <Skeleton className="mx-auto mb-6 h-20 w-20 rounded-full" />
        <Skeleton className="mx-auto mb-2 h-8 w-64" />
        <Skeleton className="mx-auto h-4 w-96" />
      </div>
      <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        <div className="mt-6 border-t border-gray-100 pt-4">
          <div className="flex justify-between">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </div>
      <div className="mt-10">
        <Skeleton className="mx-auto h-12 w-48 rounded-xl" />
      </div>
    </div>
  );
}
