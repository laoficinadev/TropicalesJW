import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  showText?: boolean;
  className?: string;
}

export function Logo({ showText = true, className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      <div className="relative h-10 w-10 overflow-hidden rounded-lg">
        <Image
          src="/logo.png"
          alt="Tropicales JW"
          fill
          className="object-cover"
          sizes="40px"
        />
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
