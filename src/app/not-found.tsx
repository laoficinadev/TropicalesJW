import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { t } from "@/lib/i18n/server";

export default async function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 scale-150">
        <Logo showText={false} />
      </div>
      <h1 className="mt-8 text-4xl font-bold text-gradient-primary sm:text-5xl">
        {await t("notFound.title")}
      </h1>
      <p className="mt-4 max-w-md text-lg text-gray-500">
        {await t("notFound.subtitle")}
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
      >
        {await t("notFound.goHome")}
      </Link>
    </div>
  );
}