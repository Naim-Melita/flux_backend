BEGIN;

INSERT INTO "ProductType" ("id", "name", "createdAt", "updatedAt")
VALUES
  ('c8d1f8d1-b8ac-4fd4-b4bf-3e4b7f000001', 'Bebidas', NOW(), NOW()),
  ('c8d1f8d1-b8ac-4fd4-b4bf-3e4b7f000002', 'Snacks', NOW(), NOW()),
  ('c8d1f8d1-b8ac-4fd4-b4bf-3e4b7f000003', 'Limpieza', NOW(), NOW()),
  ('c8d1f8d1-b8ac-4fd4-b4bf-3e4b7f000004', 'Lacteos', NOW(), NOW()),
  ('c8d1f8d1-b8ac-4fd4-b4bf-3e4b7f000005', 'Almacen', NOW(), NOW())
ON CONFLICT ("name") DO UPDATE
SET "updatedAt" = EXCLUDED."updatedAt";

WITH product_seed ("id", "barcode", "name", "scans", "imageUrl", "category") AS (
  VALUES
    ('8f5a9b14-e8e4-4f69-a101-000000000001', '7791234567890', 'Coca-Cola 500ml', 0, 'https://placehold.co/600x400.png?text=Coca+500', 'Bebidas'),
    ('8f5a9b14-e8e4-4f69-a101-000000000002', '7791234567891', 'Pepsi 500ml', 0, 'https://placehold.co/600x400.png?text=Pepsi+500', 'Bebidas'),
    ('8f5a9b14-e8e4-4f69-a101-000000000003', '7791234567892', 'Agua Mineral 1.5L', 0, 'https://placehold.co/600x400.png?text=Agua+1.5L', 'Bebidas'),
    ('8f5a9b14-e8e4-4f69-a101-000000000004', '7791234567893', 'Papas Fritas Clasicas 150g', 0, 'https://placehold.co/600x400.png?text=Papas+150g', 'Snacks'),
    ('8f5a9b14-e8e4-4f69-a101-000000000005', '7791234567894', 'Galletitas de Chocolate 120g', 0, 'https://placehold.co/600x400.png?text=Galletitas', 'Snacks'),
    ('8f5a9b14-e8e4-4f69-a101-000000000006', '7791234567895', 'Detergente Limon 750ml', 0, 'https://placehold.co/600x400.png?text=Detergente', 'Limpieza'),
    ('8f5a9b14-e8e4-4f69-a101-000000000007', '7791234567896', 'Lavandina 1L', 0, 'https://placehold.co/600x400.png?text=Lavandina+1L', 'Limpieza'),
    ('8f5a9b14-e8e4-4f69-a101-000000000008', '7791234567897', 'Leche Entera 1L', 0, 'https://placehold.co/600x400.png?text=Leche+1L', 'Lacteos'),
    ('8f5a9b14-e8e4-4f69-a101-000000000009', '7791234567898', 'Yogur Vainilla 190g', 0, 'https://placehold.co/600x400.png?text=Yogur+190g', 'Lacteos'),
    ('8f5a9b14-e8e4-4f69-a101-000000000010', '7791234567899', 'Arroz Largo Fino 1kg', 0, 'https://placehold.co/600x400.png?text=Arroz+1kg', 'Almacen'),
    ('8f5a9b14-e8e4-4f69-a101-000000000011', '7791234567800', 'Fideos Spaghetti 500g', 0, 'https://placehold.co/600x400.png?text=Spaghetti+500g', 'Almacen'),
    ('8f5a9b14-e8e4-4f69-a101-000000000012', '7791234567801', 'Azucar 1kg', 0, 'https://placehold.co/600x400.png?text=Azucar+1kg', 'Almacen')
)
INSERT INTO "Product" (
  "id",
  "barcode",
  "name",
  "scans",
  "imageUrl",
  "category",
  "productTypeId",
  "createdAt",
  "updatedAt"
)
SELECT
  ps."id",
  ps."barcode",
  ps."name",
  ps."scans",
  ps."imageUrl",
  ps."category",
  pt."id",
  NOW(),
  NOW()
FROM product_seed ps
LEFT JOIN "ProductType" pt
  ON pt."name" = ps."category"
ON CONFLICT ("barcode") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "imageUrl" = EXCLUDED."imageUrl",
  "category" = EXCLUDED."category",
  "productTypeId" = EXCLUDED."productTypeId",
  "updatedAt" = NOW();

COMMIT;
