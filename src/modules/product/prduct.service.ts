import Product, { ProductDocument } from "../../models/Product";

export interface ProductStats {
  totalBarcodes: number;
  totalScans: number;
  latest: ProductDocument[];
}

export interface CreateProductInput {
  barcode: string;
  name?: string;
  imageUrl?: string;
}

export interface UpdateProductInput {
  barcode?: string;
  name?: string;
  imageUrl?: string;
}

export async function getAllProductsService(): Promise<ProductDocument[]> {
  return Product.find();
}

export async function getTopProductsService(): Promise<ProductDocument[]> {
  return Product.find().sort({ scans: -1 }).limit(10);
}

export async function getStatsService(): Promise<ProductStats> {
  const totalBarcodes = await Product.countDocuments();
  const totalScansAgg = await Product.aggregate([
    { $group: { _id: null, scans: { $sum: "$scans" } } },
  ]);
  const totalScans = totalScansAgg[0]?.scans || 0;
  const latest = await Product.find().sort({ createdAt: -1 }).limit(5);

  return { totalBarcodes, totalScans, latest };
}

export async function getProductByBarcodeService(
  barcode: string,
): Promise<ProductDocument | null> {
  return Product.findOne({ barcode });
}

export async function getLatestProductsService(): Promise<ProductDocument[]> {
  return Product.find().sort({ createdAt: -1 }).limit(10);
}

export async function getTotalCountService(): Promise<number> {
  return Product.countDocuments();
}

export async function getProductByIdAndIncrementScansService(
  id: string,
): Promise<ProductDocument | null> {
  return Product.findByIdAndUpdate(id, { $inc: { scans: 1 } }, { new: true });
}

export async function createProductService(
  data: CreateProductInput,
): Promise<ProductDocument> {
  return Product.create(data);
}

export async function updateProductService(
  id: string,
  updateData: UpdateProductInput,
): Promise<ProductDocument | null> {
  return Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
}

export async function deleteProductService(
  id: string,
): Promise<ProductDocument | null> {
  return Product.findByIdAndDelete(id);
}

export async function fixProductUrlsService(): Promise<number> {
  const result = await Product.updateMany({ imageUrl: /^\/https/ }, [
    {
      $set: {
        imageUrl: {
          $substr: ["$imageUrl", 1, { $strLenCP: "$imageUrl" }],
        },
      },
    },
  ]);

  return result.modifiedCount;
}
