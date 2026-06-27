"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Logo } from "@/components/layout/Logo";
import { useLocale } from "@/lib/i18n";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const phone = form.get("phone") as string;

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t("auth.registerError"));
      }

      toast.success(t("auth.registerSuccess"));

      const result = await signIn("user", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("auth.registerError"));
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm items-center px-4 py-16">
      <div className="w-full">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Logo showText={false} />
          </div>
          <h1 className="text-xl font-semibold text-gradient-primary">
            {t("auth.registerTitle")}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("auth.registerSubtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              {t("auth.name")}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t("auth.email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              {t("auth.phone")}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              placeholder="+53 5555 5555"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t("auth.password")}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm shadow-sm transition focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primary disabled:opacity-50"
          >
            {loading ? t("auth.registering") : t("auth.registerButton")}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {t("auth.hasAccount")}{" "}
          <Link href="/login" className="font-medium text-brand-accent hover:underline">
            {t("auth.loginButton")}
          </Link>
        </p>
      </div>
    </div>
  );
}
