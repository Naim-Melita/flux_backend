import { prisma } from "../../lib/prisma";
import { Barcode } from "./product.interface";

export interface ProductStats {
  totalBarcodes: number;
  totalScans: number;
  latest: Barcode[];
}

export interface CreateProductInput {
  barcode: string;
  name?: string;
  imageUrl?: string;
  category?: string;
}

export interface UpdateProductInput {
  barcode?: string;
  name?: string;
  imageUrl?: string;
  category?: string;
}

function toBarcodeDTO(product: {
  id: string;
  barcode: string;
  name: string | null;
  scans: number;
  imageUrl: string | null;
  category: string | null;
  productTypeId: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Barcode {
  return {
    _id: product.id,
    id: product.id,
    barcode: product.barcode,
    name: product.name ?? "",
    scans: product.scans,
    imageUrl: product.imageUrl ?? "",
    category: product.category ?? "",
    productTypeId: product.productTypeId ?? undefined,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export async function getAllProductsService(): Promise<Barcode[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return products.map(toBarcodeDTO);
}

export async function getTopProductsService(): Promise<Barcode[]> {
  const products = await prisma.product.findMany({
    orderBy: { scans: "desc" },
    take: 10,
  });
  return products.map(toBarcodeDTO);
}

export async function getStatsService(): Promise<ProductStats> {
  const totalBarcodes = await prisma.product.count();
  const totalScansAgg = await prisma.product.aggregate({
    _sum: { scans: true },
  });
  const totalScans = totalScansAgg._sum.scans ?? 0;
  const latestProducts = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return { totalBarcodes, totalScans, latest: latestProducts.map(toBarcodeDTO) };
}

export async function getProductByBarcodeService(
  barcode: string,
): Promise<Barcode | null> {
  const product = await prisma.product.findUnique({
    where: { barcode },
  });
  return product ? toBarcodeDTO(product) : null;
}

export async function getLatestProductsService(): Promise<Barcode[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return products.map(toBarcodeDTO);
}

export async function getTotalCountService(): Promise<number> {
  return prisma.product.count();
}

export async function getProductByIdAndIncrementScansService(
  id: string,
): Promise<Barcode | null> {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }
  const updated = await prisma.product.update({
    where: { id },
    data: { scans: { increment: 1 } },
  });
  return toBarcodeDTO(updated);
}

export async function createProductService(
  data: CreateProductInput,
): Promise<Barcode> {
  const created = await prisma.product.create({
    data: {
      barcode: data.barcode,
      name: data.name,
      imageUrl: data.imageUrl,
      category: data.category,
    },
  });
  return toBarcodeDTO(created);
}

export async function updateProductService(
  id: string,
  updateData: UpdateProductInput,
): Promise<Barcode | null> {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }
  const updated = await prisma.product.update({
    where: { id },
    data: updateData,
  });
  return toBarcodeDTO(updated);
}

export async function deleteProductService(
  id: string,
): Promise<Barcode | null> {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }
  const deleted = await prisma.product.delete({ where: { id } });
  return toBarcodeDTO(deleted);
}

export async function fixProductUrlsService(): Promise<number> {
  const products = await prisma.product.findMany({
    where: {
      imageUrl: {
        startsWith: "/https",
      },
    },
    select: { id: true, imageUrl: true },
  });

  await Promise.all(
    products.map((product: { id: string; imageUrl: string | null }) =>
      prisma.product.update({
        where: { id: product.id },
        data: { imageUrl: product.imageUrl?.slice(1) ?? null },
      }),
    ),
  );

  return products.length;
}
