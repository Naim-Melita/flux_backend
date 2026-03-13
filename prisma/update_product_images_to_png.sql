BEGIN;

UPDATE "Product"
SET
  "imageUrl" = REPLACE("imageUrl", 'https://placehold.co/600x400?text=', 'https://placehold.co/600x400.png?text='),
  "updatedAt" = NOW()
WHERE
  "imageUrl" LIKE 'https://placehold.co/600x400?text=%';

COMMIT;
