"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { useLocale } from "@/lib/i18n";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="mt-auto border-t border-brand-primary/10 bg-gradient-to-b from-white to-brand-light/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm leading-relaxed text-gray-500">
              {t("footer.description")}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-900">
              {t("footer.links")}
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/productos", label: t("nav.products") },
                { href: "/contacto", label: t("nav.contact") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition hover:text-brand-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-900">
              {t("footer.contact")}
            </h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-accent" />
                theoffice7075@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-accent" />
                +53 56671258
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-900">
              {t("footer.hours")}
            </h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>{t("contact.weekdays")}</li>
              <li>{t("contact.saturday")}</li>
              <li className="text-gray-400">{t("contact.sunday")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-brand-primary/10 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} TropicalesJW.{" "}
          {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
