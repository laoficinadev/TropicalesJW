import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  showText?: boolean;
  className?: string;
  lightText?: boolean;
}

export function Logo({ showText = true, className = "", lightText = false }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <Image
        src="/logo.webp"
        alt="Tropicales JW"
        height={40}
        width={63}
        className="shrink-0"
        priority
        unoptimized
      />
      {showText && (
        <span
          className={`text-xl sm:text-2xl font-bold tracking-tight logo-text transition-colors group-hover:text-brand-accent whitespace-nowrap ${
            lightText ? "text-white" : "text-gradient-primary"
          }`}
        >
          TropicalesJW
        </span>
      )}
    </Link>
  );
}
