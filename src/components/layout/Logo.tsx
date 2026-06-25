import Link from "next/link";

interface LogoProps {
  showText?: boolean;
  className?: string;
}

export function Logo({ showText = true, className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-brand-primary text-sm font-bold text-white shadow-sm">
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
        >
          <path
            d="M20 4C18 4 14 7 14 12C14 17 17 22 20 26C23 22 26 17 26 12C26 7 22 4 20 4Z"
            fill="white"
            fillOpacity="0.3"
          />
          <path
            d="M20 8C18.5 8 16 10 16 13.5C16 17 18 20 20 22.5C22 20 24 17 24 13.5C24 10 21.5 8 20 8Z"
            fill="white"
          />
          <rect x="18.5" y="23" width="3" height="7" rx="1.5" fill="white" />
          <ellipse cx="20" cy="31" rx="6" ry="2" fill="white" fillOpacity="0.4" />
        </svg>
      </div>
      {showText && (
        <div className="flex items-baseline gap-0.5">
          <span className="text-xl font-bold tracking-tight text-brand-primary transition-colors group-hover:text-brand-accent">
            Tropicales
          </span>
          <span className="text-xl font-light tracking-tight text-brand-accent">
            JW
          </span>
        </div>
      )}
    </Link>
  );
}
