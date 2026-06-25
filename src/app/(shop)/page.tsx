import { Leaf, Truck, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
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
