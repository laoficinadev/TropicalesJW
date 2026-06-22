import Link from "next/link";

interface LogoProps {
  showText?: boolean;
  className?: string;
}

export function Logo({ showText = true, className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-emerald-600 to-amber-500 text-sm font-bold text-white shadow-sm">
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
        >
          <path
            d="M20 4C15 4 10 8 10 14C10 20 14 26 20 32C26 26 30 20 30 14C30 8 25 4 20 4Z"
            fill="white"
            fillOpacity="0.3"
            stroke="white"
            strokeWidth="1.5"
          />
          <circle cx="20" cy="14" r="3" fill="white" />
        </svg>
      </div>
      {showText && (
        <div className="flex items-baseline gap-0.5">
          <span className="text-xl font-bold tracking-tight text-emerald-700 transition-colors group-hover:text-emerald-600">
            Tropicales
          </span>
          <span className="text-xl font-light tracking-tight text-amber-600">
            JW
          </span>
        </div>
      )}
    </Link>
  );
}
