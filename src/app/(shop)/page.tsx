import Link from "next/link";
import { Leaf, Truck, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary-dark via-brand-primary to-brand-accent py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
              Productos Tropicales
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Frescura Tropical
              <span className="block text-brand-accent/30">para tu hogar</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/80">
              Descubre nuestra selección de productos tropicales frescos y de la
              mejor calidad. Directo de la naturaleza a tu mesa.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-primary shadow-sm transition hover:bg-brand-light hover:shadow-md"
              >
                Ver Productos
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              {
                icon: Leaf,
                title: "100% Natural",
                desc: "Productos frescos directamente de la naturaleza",
              },
              {
                icon: Truck,
                title: "Envío Rápido",
                desc: "Entregas en todo el país en 24-48 horas",
              },
              {
                icon: Shield,
                title: "Calidad Garantizada",
                desc: "Seleccionamos los mejores productos para ti",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand-primary">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Productos Destacados
            </h2>
            <p className="mt-4 text-lg text-gray-500">
          Proximamente...
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
