export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200/60 dark:bg-gray-700/40 rounded ${className}`}
    />
  );
}
