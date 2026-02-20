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
  getTopProductsHandler,
  getTotalCountHandler,
  updateProductHandler,
} from "./product.controller";

const router = express.Router();

/* --- RUTAS FIJAS ANTES DE LA RUTA POR ID --- */

// Top barcodes
router.get("/top", authApiKey, getTopProductsHandler);

// Stats globales
router.get("/stats", authApiKey, getStatsHandler);

// Buscar por código exacto
router.get("/search/:barcode", authApiKey, getProductByBarcodeHandler);

// Últimos barcodes
router.get("/latest", authApiKey, getLatestProductsHandler);

// Conteo total
router.get("/count", authApiKey, getTotalCountHandler);

/* --- RUTA GENERAL PARA TODOS LOS BARCODES --- */
router.get("/", authApiKey, getAllProductsHandler);

/* --- RUTA POR ID --- */
router.get("/:id", authApiKey, getProductByIdHandler);

/* --- POST --- */
router.post(
  "/",
  authApiKey,
  upload.single("image"), // <-- primero multer
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

/* --- PUT --- */
router.put(
  "/:id",
  authApiKey,
  upload.single("image"), // <-- primero multer
  [
    body("barcode")
      .optional()
      .isString()
      .withMessage("El código debe ser texto"),
    body("name").optional().isString().withMessage("El nombre debe ser texto"),
  ],
  updateProductHandler,
);
/* --- DELETE --- */
router.delete("/:id", authApiKey, deleteProductHandler);
router.post("/fix-urls", fixProductUrlsHandler);

export default router;
