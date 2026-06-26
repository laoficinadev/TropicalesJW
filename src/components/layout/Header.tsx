"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Search, Menu, X, Package, User, LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { CartBadge } from "../carrito/CartBadge";
import { DarkModeToggle } from "./DarkModeToggle";
import { useLocale } from "@/lib/i18n";

export function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t, locale, setLocale } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = searchRef.current?.value.trim();
    if (q) {
      router.push(`/buscar?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      if (searchRef.current) searchRef.current.value = "";
    }
  }

  function toggleLanguage() {
    setLocale(locale === "es" ? "en" : "es");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-primary/10 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center gap-2 pl-0 pr-2">
        <Logo />

        {/* Desktop search bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="flex w-full">
            <input
              ref={searchRef}
              type="text"
              placeholder={t("nav.searchPlaceholder")}
              className="w-full rounded-l-lg border border-brand-accent/30 bg-gray-50 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-brand-accent focus:bg-white"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-r-lg bg-brand-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-accent-dark"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-1">
          <DarkModeToggle />

          <button
            onClick={toggleLanguage}
            className="rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 transition hover:bg-brand-light hover:text-brand-accent"
          >
            {t("nav.language")}
          </button>

          {status === "authenticated" ? (
            <div className="group relative">
              <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-brand-light hover:text-brand-primary">
                <User className="h-4 w-4" />
                <span className="max-w-[80px] truncate">{session.user.name}</span>
              </button>
              <div className="invisible absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-gray-100 bg-white py-1 shadow-lg opacity-0 transition group-hover:visible group-hover:opacity-100">
                <Link
                  href="/pedidos"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 transition hover:bg-brand-light hover:text-brand-primary"
                >
                  <Package className="h-4 w-4" />
                  {t("nav.myOrders")}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-600 transition hover:bg-brand-light hover:text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  {t("nav.logout")}
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-brand-light hover:text-brand-primary"
            >
              <User className="h-4 w-4" />
              {t("nav.login")}
            </Link>
          )}

          <Link
            href="/pedidos"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-brand-light hover:text-brand-primary"
          >
            <Package className="h-4 w-4" />
            {t("nav.myOrders")}
          </Link>

          <CartBadge />
        </div>

        {/* Mobile: search toggle + menu toggle */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="rounded-full p-2 text-gray-500 transition hover:bg-brand-light hover:text-brand-primary"
            aria-label="Buscar"
          >
            <Search className="h-5 w-5" />
          </button>
          <CartBadge />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-full p-2 text-gray-500 transition hover:bg-brand-light hover:text-brand-primary"
            aria-label="Abrir menú"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="border-t border-brand-primary/10 px-2 py-3 md:hidden">
          <form onSubmit={handleSearch} className="flex w-full">
            <input
              ref={searchRef}
              type="text"
              placeholder={t("nav.searchPlaceholder")}
              autoFocus
              className="w-full rounded-l-lg border border-brand-accent/30 bg-gray-50 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-brand-accent focus:bg-white"
            />
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-r-lg bg-brand-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-accent-dark"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-brand-primary/10 md:hidden animate-fade-in">
          <nav className="flex flex-col gap-1 px-4 py-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-brand-light hover:text-brand-primary"
            >
              <span className="text-xs font-bold uppercase tracking-wider">{t("nav.language")}</span>
              <span className="text-gray-400">|</span>
              <span className="text-sm">{locale === "es" ? "Español" : "English"}</span>
            </button>

            <Link
              href="/productos"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-brand-light hover:text-brand-primary"
              onClick={() => setMenuOpen(false)}
            >
              {t("nav.products")}
            </Link>

            <Link
              href="/contacto"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-brand-light hover:text-brand-primary"
              onClick={() => setMenuOpen(false)}
            >
              {t("nav.contact")}
            </Link>

            <div className="my-2 border-t border-gray-100" />

            {status === "authenticated" ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-900">
                  <User className="h-4 w-4 text-gray-400" />
                  {session.user.name}
                </div>
                <Link
                  href="/pedidos"
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-brand-light hover:text-brand-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  <Package className="h-4 w-4" />
                  {t("nav.myOrders")}
                </Link>
                <button
                  onClick={() => { setMenuOpen(false); signOut(); }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-brand-light hover:text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-brand-light hover:text-brand-primary"
                onClick={() => setMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                {t("nav.login")}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
