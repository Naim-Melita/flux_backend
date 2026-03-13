import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { prisma } from "../../lib/prisma";
import {
  createProductService,
  deleteProductService,
  fixProductUrlsService,
  getAllProductsService,
  getLatestProductsService,
  getProductByBarcodeService,
  getProductByIdAndIncrementScansService,
  getStatsService,
  getTopProductsService,
  getTotalCountService,
  type UpdateProductInput,
  updateProductService,
} from "./product.service";

export async function getTopProductsHandler(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const products = await getTopProductsService();
    return res.json(products);
  } catch (error: any) {
    console.error("TOP ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}

// export async function getStatsHandler(
//   req: Request,
//   res: Response,
// ): Promise<Response> {
//   try {
//     const stats = await getStatsService();
//     return res.json(stats);
//   } catch (error: any) {
//     console.error("STATS ERROR:", error);
//     return res.status(500).json({ error: error.message });
//   }
// }

export async function getProductByBarcodeHandler(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { barcode } = req.params;
    const result = await getProductByBarcodeService(barcode as string);
    if (!result) {
      return res.status(404).json({ error: "Barcode no encontrado" });
    }
    return res.json(result);
  } catch (error: any) {
    console.error("SEARCH ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}

export async function getLatestProductsHandler(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const latestProducts = await getLatestProductsService();
    return res.json(latestProducts);
  } catch (error: any) {
    console.error("LATEST ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}

export async function getTotalCountHandler(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const total = await getTotalCountService();
    return res.json({ total });
  } catch (error: any) {
    console.error("COUNT ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}
export type CreateProductInput = {
  barcode: string;
  name?: string;
  imageUrl?: string;
  category?: string; // 👈 nuevo campo
};

export async function getAllProductsHandler(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const products = await getAllProductsService();
    return res.json(products);
  } catch (error: any) {
    console.error("GET ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}

export async function getProductByIdHandler(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const product = await getProductByIdAndIncrementScansService(id as string);
    if (!product) {
      return res.status(404).json({ error: "Barcode no encontrado" });
    }

    return res.json(product);
  } catch (error: any) {
    console.error("GET BY ID ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}

export async function createProductHandler(
  req: Request,
  res: Response,
): Promise<Response> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    console.log("BODY RECIBIDO:", req.body); // 👈 log para ver qué llega
    const { barcode, name, category } = req.body;

    const newProduct = await createProductService({
      barcode,
      name,
      category, // 👈 nuevo campo
      imageUrl: req.file?.secure_url || req.file?.path,
    });

    return res.status(201).json(newProduct);
  } catch (error: any) {
    console.error("CONTROLLER ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}


export async function updateProductHandler(
  req: Request,
  res: Response,
): Promise<Response> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const { barcode, name } = req.body;
    const updateData: UpdateProductInput = {};
    if (barcode) updateData.barcode = barcode;
    if (name) updateData.name = name;
    
    if (req.file) updateData.imageUrl = req.file?.secure_url || req.file?.path;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: "Debes enviar 'barcode', 'name' o 'image' para actualizar",
      });
    }

    const updatedProduct = await updateProductService(id as string, updateData);
    if (!updatedProduct) {
      return res.status(404).json({ error: "Barcode no encontrado" });
    }

    return res.json(updatedProduct);
  } catch (error: any) {
    console.error("PUT ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}

export async function deleteProductHandler(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const deletedProduct = await deleteProductService(id as string);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Barcode no encontrado" });
    }

    return res.json({
      message: "Barcode eliminado correctamente",
      deletedBarcode: deletedProduct,
    });
  } catch (error: any) {
    console.error("DELETE ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
}

export async function fixProductUrlsHandler(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const updated = await fixProductUrlsService();
    return res.json({ updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Obtener estadísticas simples (ejemplo: cantidad de productos)
export const getStatsHandler = async (req: Request, res: Response) => {
  try {
    const totalProducts = await prisma.product.count();
    const totalCategories = await prisma.productType.count();
    const latestProducts = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    res.json({
      totalProducts,
      totalCategories,
      latest: latestProducts, // 👈 ahora sí existe stats.latest
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


// Obtener top barcodes (ejemplo: productos más escaneados)
export const getTopHandler = async (req: Request, res: Response) => {
  try {
    const topProducts = await prisma.product.findMany({
      orderBy: { scans: "desc" },
      take: 5,
    });

    res.json(topProducts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
