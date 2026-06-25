import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  showText?: boolean;
  className?: string;
}

export function Logo({ showText = true, className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <Image
        src="/logo.png"
        alt="Tropicales JW"
        height={40}
        width={63}
        className="object-contain shrink-0"
        priority
      />
      {showText && (
        <span className="text-lg sm:text-xl font-bold tracking-tight text-brand-primary transition-colors group-hover:text-brand-accent whitespace-nowrap">
          TropicalesJW
        </span>
      )}
    </Link>
  );
}
