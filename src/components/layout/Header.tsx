"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { CartBadge } from "../carrito/CartBadge";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/productos", label: "Productos" },
    { href: "/contacto", label: "Contacto" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100/50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative transition hover:text-emerald-600 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-emerald-500 after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/buscar"
            className="rounded-full p-2 text-gray-500 transition hover:bg-emerald-50 hover:text-emerald-600"
          >
            <Search className="h-5 w-5" />
          </Link>
          <CartBadge />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-full p-2 text-gray-500 transition hover:bg-emerald-50 hover:text-emerald-600 md:hidden"
            aria-label="Abrir menú"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-emerald-100/50 md:hidden animate-fade-in">
          <nav className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-emerald-50 hover:text-emerald-600"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
