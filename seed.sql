-- Seed: Categorías
INSERT INTO "Category" (id, name, slug, "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'Frutas Tropicales', 'frutas-tropicales', NOW(), NOW()),
  (gen_random_uuid(), 'Raíces y Viandas', 'raices-y-viandas', NOW(), NOW()),
  (gen_random_uuid(), 'Vegetales', 'vegetales', NOW(), NOW()),
  (gen_random_uuid(), 'Especias y Condimentos', 'especias-y-condimentos', NOW(), NOW()),
  (gen_random_uuid(), 'Bebidas Naturales', 'bebidas-naturales', NOW(), NOW()),
  (gen_random_uuid(), 'Mieles y Dulces', 'mieles-y-dulces', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Obtener IDs de categorías
DO $$
DECLARE
  frutas_id UUID;
  raices_id UUID;
  vegetales_id UUID;
  especias_id UUID;
  bebidas_id UUID;
  mieles_id UUID;
BEGIN
  SELECT id INTO frutas_id FROM "Category" WHERE slug = 'frutas-tropicales';
  SELECT id INTO raices_id FROM "Category" WHERE slug = 'raices-y-viandas';
  SELECT id INTO vegetales_id FROM "Category" WHERE slug = 'vegetales';
  SELECT id INTO especias_id FROM "Category" WHERE slug = 'especias-y-condimentos';
  SELECT id INTO bebidas_id FROM "Category" WHERE slug = 'bebidas-naturales';
  SELECT id INTO mieles_id FROM "Category" WHERE slug = 'mieles-y-dulces';

  -- Productos: Frutas Tropicales
  INSERT INTO "Product" (id, name, slug, description, price, images, stock, published, featured, "categoryId", "createdAt", "updatedAt")
  VALUES
    (gen_random_uuid(), 'Piña Cayena Lisa', 'pina-cayena-lisa', 'Piña fresca cultivada en Cuba, dulce y jugosa. Ideal para jugos y postres.', 850, '[]', 50, true, true, frutas_id, NOW(), NOW()),
    (gen_random_uuid(), 'Mango Kent', 'mango-kent', 'Mango de la variedad Kent, dulce y fibra mínima. Perfecto para consumo natural.', 1200, '[]', 30, true, true, frutas_id, NOW(), NOW()),
    (gen_random_uuid(), 'Papaya Maradol', 'papaya-maradol', 'Papaya maradol de gran tamaño, dulce y refrescante. Rica en vitaminas.', 1500, '[]', 25, true, true, frutas_id, NOW(), NOW()),
    (gen_random_uuid(), 'Plátano Fruta', 'platano-fruta', 'Plátano fruta maduro, dulce y cremoso. Ideal para meriendas y batidos.', 350, '[]', 100, true, false, frutas_id, NOW(), NOW()),
    (gen_random_uuid(), 'Guayaba Rosada', 'guayaba-rosada', 'Guayaba rosada fresca, aroma intenso y sabor único. Perfecta para mermeladas.', 600, '[]', 40, true, false, frutas_id, NOW(), NOW()),
    (gen_random_uuid(), 'Coco Rallado Natural', 'coco-rallado-natural', 'Coco rallado fresco, sin azúcar añadida. Ideal para repostería y cocina.', 450, '[]', 60, true, false, frutas_id, NOW(), NOW());

  -- Productos: Raíces y Viandas
  INSERT INTO "Product" (id, name, slug, description, price, images, stock, published, featured, "categoryId", "createdAt", "updatedAt")
  VALUES
    (gen_random_uuid(), 'Yuca Blanca', 'yuca-blanca', 'Yuca fresca, ideal para frituras, casabe y platos tradicionales.', 400, '[]', 80, true, false, raices_id, NOW(), NOW()),
    (gen_random_uuid(), 'Boniato', 'boniato', 'Boniato dulce, perfecto para asar, hervir o hacer puré.', 350, '[]', 70, true, false, raices_id, NOW(), NOW()),
    (gen_random_uuid(), 'Malanga', 'malanga', 'Malanga fresca, ideal para sopas, frituras y platos tradicionales cubanos.', 500, '[]', 45, true, false, raices_id, NOW(), NOW()),
    (gen_random_uuid(), 'Ñame', 'name', 'Ñame blanco, perfecto para guisos y potajes.', 550, '[]', 35, true, false, raices_id, NOW(), NOW()),
    (gen_random_uuid(), 'Plátano Macho', 'platano-macho', 'Plátano macho verde, ideal para tostones, maduros y chatinos.', 300, '[]', 90, true, false, raices_id, NOW(), NOW()),
    (gen_random_uuid(), 'Papa Criolla', 'papa-criolla', 'Papa cultivada localmente, ideal para ensaladas y guisos.', 450, '[]', 60, true, false, raices_id, NOW(), NOW());

  -- Productos: Vegetales
  INSERT INTO "Product" (id, name, slug, description, price, images, stock, published, featured, "categoryId", "createdAt", "updatedAt")
  VALUES
    (gen_random_uuid(), 'Tomate Pera', 'tomate-pera', 'Tomate pera fresco, ideal para salsas y ensaladas.', 300, '[]', 100, true, false, vegetales_id, NOW(), NOW()),
    (gen_random_uuid(), 'Cebolla Roja', 'cebolla-roja', 'Cebolla roja cultivada localmente, sabor intenso ideal para ensaladas.', 250, '[]', 80, true, false, vegetales_id, NOW(), NOW()),
    (gen_random_uuid(), 'Ají Chileno', 'aji-chileno', 'Ají chileno fresco, picante moderado. Ideal para aderezos y sofritos.', 200, '[]', 50, true, false, vegetales_id, NOW(), NOW()),
    (gen_random_uuid(), 'Calabaza', 'calabaza', 'Calabaza fresca, dulce y versátil. Perfecta para sopas y purés.', 400, '[]', 30, true, false, vegetales_id, NOW(), NOW()),
    (gen_random_uuid(), 'Lechuga Criolla', 'lechuga-criolla', 'Lechuga fresca cultivada localmente, hojas tiernas y crujientes.', 200, '[]', 40, true, false, vegetales_id, NOW(), NOW()),
    (gen_random_uuid(), 'Pepino', 'pepino', 'Pepino fresco, ideal para ensaladas y jugos detox.', 250, '[]', 55, true, false, vegetales_id, NOW(), NOW());

  -- Productos: Especias y Condimentos
  INSERT INTO "Product" (id, name, slug, description, price, images, stock, published, featured, "categoryId", "createdAt", "updatedAt")
  VALUES
    (gen_random_uuid(), 'Orégano Molido', 'oregano-molido', 'Orégano molido natural, aroma intenso. Ideal para sazonar carnes y salsas.', 150, '[]', 200, true, false, especias_id, NOW(), NOW()),
    (gen_random_uuid(), 'Comino en Grano', 'comino-en-grano', 'Comino en grano seleccionado, sabor auténtico para tus recetas.', 180, '[]', 150, true, false, especias_id, NOW(), NOW()),
    (gen_random_uuid(), 'Ajo en Polvo', 'ajo-en-polvo', 'Ajo en polvo natural, ideal para adobar carnes y pescados.', 200, '[]', 180, true, false, especias_id, NOW(), NOW()),
    (gen_random_uuid(), 'Pimienta Negra Molida', 'pimienta-negra-molida', 'Pimienta negra molida, grano seleccionado. Sabor intenso.', 250, '[]', 120, true, false, especias_id, NOW(), NOW()),
    (gen_random_uuid(), 'Hojas de Laurel', 'hojas-de-laurel', 'Hojas de laurel secas, ideales para potajes y guisos.', 100, '[]', 300, true, false, especias_id, NOW(), NOW()),
    (gen_random_uuid(), 'Canela en Rama', 'canela-en-rama', 'Canela en rama de alta calidad, ideal para infusiones y postres.', 350, '[]', 80, true, false, especias_id, NOW(), NOW());

  -- Productos: Bebidas Naturales
  INSERT INTO "Product" (id, name, slug, description, price, images, stock, published, featured, "categoryId", "createdAt", "updatedAt")
  VALUES
    (gen_random_uuid(), 'Jugo de Tamarindo', 'jugo-de-tamarindo', 'Jugo natural de tamarindo, sabor agridulce refrescante. Botella 1L.', 500, '[]', 40, true, true, bebidas_id, NOW(), NOW()),
    (gen_random_uuid(), 'Jugo de Maracuyá', 'jugo-de-maracuya', 'Jugo natural de maracuyá, intenso y refrescante. Botella 1L.', 550, '[]', 35, true, false, bebidas_id, NOW(), NOW()),
    (gen_random_uuid(), 'Refresco de Malta', 'refresco-de-malta', 'Malta tradicional, refresco natural fermentado. Botella 750ml.', 350, '[]', 60, true, false, bebidas_id, NOW(), NOW()),
    (gen_random_uuid(), 'Agua de Coco', 'agua-de-coco', 'Agua de coco natural envasada, hidratante y nutritiva. Botella 500ml.', 250, '[]', 100, true, false, bebidas_id, NOW(), NOW()),
    (gen_random_uuid(), 'Jugo de Caña', 'jugo-de-cana', 'Jugo de caña de azúcar natural, dulce y energizante. Botella 500ml.', 200, '[]', 80, true, false, bebidas_id, NOW(), NOW());

  -- Productos: Mieles y Dulces
  INSERT INTO "Product" (id, name, slug, description, price, images, stock, published, featured, "categoryId", "createdAt", "updatedAt")
  VALUES
    (gen_random_uuid(), 'Miel de Abeja Pura', 'miel-de-abeja-pura', 'Miel de abeja 100% pura, sin aditivos. Envase de 500g.', 800, '[]', 50, true, true, mieles_id, NOW(), NOW()),
    (gen_random_uuid(), 'Dulce de Guayaba', 'dulce-de-guayaba', 'Dulce tradicional de guayaba, ideal para postres y meriendas. 400g.', 350, '[]', 40, true, false, mieles_id, NOW(), NOW()),
    (gen_random_uuid(), 'Cajeta de Coco', 'cajeta-de-coco', 'Cajeta de coco tradicional, dulce artesanal. 250g.', 300, '[]', 35, true, false, mieles_id, NOW(), NOW()),
    (gen_random_uuid(), 'Mermelada de Mango', 'mermelada-de-mango', 'Mermelada artesanal de mango, sin conservantes. Frasco 300g.', 450, '[]', 30, true, false, mieles_id, NOW(), NOW()),
    (gen_random_uuid(), 'Panela Natural', 'panela-natural', 'Panela natural 100% caña de azúcar, endulzante natural. 500g.', 280, '[]', 70, true, false, mieles_id, NOW(), NOW());
END $$;
