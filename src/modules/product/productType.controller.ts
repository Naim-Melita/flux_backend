// product.controller.ts
import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export const createProductHandler = async (req: Request, res: Response) => {
  try {
    const { barcode, name, imageUrl, categoryName } = req.body;

    // Buscar categoría por nombre
    let category = await prisma.productType.findUnique({
      where: { name: categoryName },
    });

    // Si no existe, crearla
    if (!category) {
      category = await prisma.productType.create({
        data: { name: categoryName },
      });
    }

    // Crear producto asociado a la categoría
    const product = await prisma.product.create({
      data: {
        barcode,
        name,
        imageUrl,
        productTypeId: category.id,
      },
    });

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }




};

export const getAllProductsHandler = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        productType: true, // esto trae la categoría asociada
      },
    });

    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
