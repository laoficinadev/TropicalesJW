import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);

  await prisma.adminUser.upsert({
    where: { email: "admin@tropicalesjw.com" },
    update: {},
    create: {
      email: "admin@tropicalesjw.com",
      name: "Admin",
      password: adminPassword,
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "frutas-frescas" },
      update: {},
      create: {
        name: "Frutas Frescas",
        slug: "frutas-frescas",
        description: "Frutas tropicales frescas directo de la finca",
      },
    }),
    prisma.category.upsert({
      where: { slug: "bebidas" },
      update: {},
      create: {
        name: "Bebidas",
        slug: "bebidas",
        description: "Jugos y bebidas tropicales naturales",
      },
    }),
    prisma.category.upsert({
      where: { slug: "snacks" },
      update: {},
      create: {
        name: "Snacks",
        slug: "snacks",
        description: "Snacks saludables y tropicales",
      },
    }),
    prisma.category.upsert({
      where: { slug: "artesanias" },
      update: {},
      create: {
        name: "Artesanías",
        slug: "artesanias",
        description: "Artesanías hechas a mano con materiales tropicales",
      },
    }),
  ]);

  const products = [
    {
      name: "Piña Dorada",
      slug: "pina-dorada",
      description:
        "Piña dulce y jugosa cultivada en las tierras tropicales. Perfecta para jugos, postres o consumo directo.",
      price: 2500,
      stock: 50,
      featured: true,
      categorySlug: "frutas-frescas",
    },
    {
      name: "Mango Tomy",
      slug: "mango-tomy",
      description:
        "Mango de la variedad Tomy, dulce y fibra suave. Ideal para batidos y ensaladas de fruta.",
      price: 3000,
      stock: 40,
      featured: true,
      categorySlug: "frutas-frescas",
    },
    {
      name: "Coco Entero",
      slug: "coco-entero",
      description:
        "Coco fresco entero con agua incluida. Ideal para hidratación natural y cocina tropical.",
      price: 1800,
      stock: 30,
      featured: true,
      categorySlug: "frutas-frescas",
    },
    {
      name: "Papaya Hawaiana",
      slug: "papaya-hawaiana",
      description:
        "Papaya dulce y suave, perfecta para el desayuno o como digestivo natural.",
      price: 2200,
      stock: 35,
      featured: false,
      categorySlug: "frutas-frescas",
    },
    {
      name: "Jugo de Maracuyá",
      slug: "jugo-maracuya",
      description:
        "Jugo natural de maracuyá, refrescante y lleno de vitamina C. Sin azúcares añadidos.",
      price: 1500,
      stock: 60,
      featured: true,
      categorySlug: "bebidas",
    },
    {
      name: "Agua de Coco 500ml",
      slug: "agua-de-coco",
      description:
        "Agua de coco 100% natural, hidratante y baja en calorías. Envase de 500ml.",
      price: 1200,
      stock: 80,
      featured: false,
      categorySlug: "bebidas",
    },
    {
      name: "Chips de Plátano",
      slug: "chips-de-platano",
      description:
        "Chips de plátano verde horneados, crujientes y saludables. Bolsa de 200g.",
      price: 2000,
      stock: 45,
      featured: false,
      categorySlug: "snacks",
    },
    {
      name: "Coco Deshidratado",
      slug: "coco-deshidratado",
      description:
        "Coco rallado deshidratado natural, perfecto para repostería y granola. Bolsa de 150g.",
      price: 1600,
      stock: 55,
      featured: false,
      categorySlug: "snacks",
    },
    {
      name: "Canasta de Palma",
      slug: "canasta-de-palma",
      description:
        "Canasta tejida a mano con hojas de palma tropical. Ideal para decoración y almacenamiento.",
      price: 8500,
      stock: 15,
      featured: true,
      categorySlug: "artesanias",
    },
    {
      name: "Sombrero de Yipijapa",
      slug: "sombrero-yipijapa",
      description:
        "Sombrero artesanal tejido con fibra de yipijapa. Liviano y fresco, perfecto para el clima tropical.",
      price: 12000,
      stock: 10,
      featured: true,
      categorySlug: "artesanias",
    },
  ];

  for (const p of products) {
    const category = categories.find((c) => c.slug === p.categorySlug);
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        stock: p.stock,
        featured: p.featured,
        published: true,
        categoryId: category?.id,
      },
    });
  }

  console.log("Seed completado exitosamente");
  console.log("Admin: admin@tropicalesjw.com / admin123");
  console.log(`Categorías: ${categories.length}`);
  console.log(`Productos: ${products.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
