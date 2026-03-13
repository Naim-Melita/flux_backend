import express from "express";
import { authApiKey } from "../../middleware/authApiKey";
import upload from "../../middleware/upload";
import { body } from "express-validator";
import {
  createProductHandler,
  deleteProductHandler,
  fixProductUrlsHandler,
  getAllProductsHandler,
  getLatestProductsHandler,
  getProductByBarcodeHandler,
  getProductByIdHandler,
  getStatsHandler,
  getTopHandler,
  getTotalCountHandler,
  updateProductHandler,
} from "./product.controller";

const router = express.Router();

/* --- RUTAS ESPECÍFICAS --- */
// Crear producto
router.post(
  "/products",
  authApiKey,
  upload.single("image"),
  [
    body("barcode")
      .notEmpty()
      .withMessage("El campo 'barcode' es requerido")
      .isString()
      .withMessage("El código debe ser texto"),
    body("name").optional().isString().withMessage("El nombre debe ser texto"),
  ],
  createProductHandler,
);

// Listar todos los productos
router.get("/products", authApiKey, getAllProductsHandler);

// Top barcodes
router.get("/products/top", authApiKey, getTopHandler);

// Stats globales
router.get("/products/stats", authApiKey, getStatsHandler);

// Buscar por código exacto
router.get("/products/search/:barcode", authApiKey, getProductByBarcodeHandler);

// Últimos barcodes
router.get("/products/latest", authApiKey, getLatestProductsHandler);

// Conteo total
router.get("/products/count", authApiKey, getTotalCountHandler);

router.get("/products/stats", authApiKey, getStatsHandler);


/* --- RUTA POR ID --- */
router.get("/products/:id", authApiKey, getProductByIdHandler);

/* --- PUT --- */
router.put(
  "/products/:id",
  authApiKey,
  upload.single("image"),
  [
    body("barcode").optional().isString().withMessage("El código debe ser texto"),
    body("name").optional().isString().withMessage("El nombre debe ser texto"),
  ],
  updateProductHandler,
);

/* --- DELETE --- */
router.delete("/products/:id", authApiKey, deleteProductHandler);

// Fix URLs
router.post("/products/fix-urls", authApiKey, fixProductUrlsHandler);

export default router;
