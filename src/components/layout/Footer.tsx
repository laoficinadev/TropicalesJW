import Link from "next/link";
import { Logo } from "./Logo";
import { t } from "@/lib/i18n/server";
import { Newsletter } from "../ui/Newsletter";

export async function Footer() {
  return (
    <footer className="mt-auto bg-brand-primary">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Newsletter />

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo lightText />
            <p className="text-sm leading-relaxed text-gray-300">
              {await t("footer.description")}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/90">
              {await t("footer.links")}
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/productos", label: await t("nav.products") },
                { href: "/contacto", label: await t("nav.contact") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/90">
              {await t("footer.contact")}
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
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
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/90">
              {await t("footer.hours")}
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>{await t("contact.weekdays")}</li>
              <li>{await t("contact.saturday")}</li>
              <li className="text-gray-400">{await t("contact.sunday")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} TropicalesJW.{" "}
          {await t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
