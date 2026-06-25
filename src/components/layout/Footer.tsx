import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-emerald-100/50 bg-gradient-to-b from-white to-emerald-50/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm leading-relaxed text-gray-500">
              Tu tienda de confianza con los mejores productos tropicales.
              Calidad y frescura garantizada.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-900">
              Enlaces
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/productos", label: "Productos" },
                { href: "/contacto", label: "Contacto" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition hover:text-emerald-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-900">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                theoffice7075@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                +53 56671258
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-900">
              Horarios
            </h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>Lun - Vie: 8:00 AM - 6:00 PM</li>
              <li>Sáb: 8:00 AM - 12:00 PM</li>
              <li className="text-gray-400">Dom: Cerrado</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-emerald-100/50 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} TropicalesJW. Todos los derechos
          reservados.
        </div>
      </div>
    </footer>
  );
}
