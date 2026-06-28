"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const DarkModeToggle = dynamic(() => import("@/components/layout/DarkModeToggle").then((m) => m.DarkModeToggle), { ssr: false });
const Logo = dynamic(() => import("@/components/layout/Logo").then((m) => m.Logo), { ssr: false });

export function AdminHeader({ email }: { email: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/admin">
          <Logo />
        </Link>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="dark:text-gray-400">{email}</span>
          <DarkModeToggle />
          <Link
            href="/"
            className="rounded-lg px-3 py-1.5 text-xs transition hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Ver tienda
          </Link>
        </div>
      </div>
    </header>
  );
}
