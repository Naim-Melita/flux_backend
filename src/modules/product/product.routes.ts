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

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Gestión de productos y códigos de barra
 */

/**
 * @swagger
 * /products/products:
 *   post:
 *     summary: Crear un producto
 *     tags: [Products]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProductCreateRequest'
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: API key ausente o inválida
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Unknown API key invalid-key
 *                     http_code:
 *                       type: integer
 *                       example: 401
 *       500:
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /products/products:
 *   get:
 *     summary: Listar todos los productos
 *     tags: [Products]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Listado de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: API key ausente o inválida
 *       500:
 *         description: Error interno
 */
router.get("/products", authApiKey, getAllProductsHandler);

/**
 * @swagger
 * /products/products/top:
 *   get:
 *     summary: Obtener el top de productos más escaneados
 *     tags: [Products]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Top de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: API key ausente o inválida
 *       500:
 *         description: Error interno
 */
router.get("/products/top", authApiKey, getTopHandler);

/**
 * @swagger
 * /products/products/stats:
 *   get:
 *     summary: Obtener estadísticas globales
 *     tags: [Products]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de productos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductStats'
 *       401:
 *         description: API key ausente o inválida
 *       500:
 *         description: Error interno
 */
router.get("/products/stats", authApiKey, getStatsHandler);

/**
 * @swagger
 * /products/products/search/{barcode}:
 *   get:
 *     summary: Buscar un producto por barcode exacto
 *     tags: [Products]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: barcode
 *         required: true
 *         schema:
 *           type: string
 *         description: Código de barras exacto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: API key ausente o inválida
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno
 */
router.get("/products/search/:barcode", authApiKey, getProductByBarcodeHandler);

/**
 * @swagger
 * /products/products/latest:
 *   get:
 *     summary: Obtener los últimos productos cargados
 *     tags: [Products]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Últimos productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: API key ausente o inválida
 *       500:
 *         description: Error interno
 */
router.get("/products/latest", authApiKey, getLatestProductsHandler);

/**
 * @swagger
 * /products/products/count:
 *   get:
 *     summary: Obtener la cantidad total de productos
 *     tags: [Products]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Conteo total
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCount'
 *       401:
 *         description: API key ausente o inválida
 *       500:
 *         description: Error interno
 */
router.get("/products/count", authApiKey, getTotalCountHandler);

router.get("/products/stats", authApiKey, getStatsHandler);


/**
 * @swagger
 * /products/products/{id}:
 *   get:
 *     summary: Obtener un producto por id e incrementar scans
 *     tags: [Products]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: API key ausente o inválida
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno
 */
router.get("/products/:id", authApiKey, getProductByIdHandler);

/**
 * @swagger
 * /products/products/{id}:
 *   put:
 *     summary: Actualizar un producto
 *     tags: [Products]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdateRequest'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Error de validación o payload vacío
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationErrorResponse'
 *                 - $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: API key ausente o inválida
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno
 */
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

/**
 * @swagger
 * /products/products/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: [Products]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Producto eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteProductResponse'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: API key ausente o inválida
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno
 */
router.delete("/products/:id", authApiKey, deleteProductHandler);

/**
 * @swagger
 * /products/products/fix-urls:
 *   post:
 *     summary: Corregir URLs de imágenes mal guardadas
 *     tags: [Products]
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Cantidad de URLs corregidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FixUrlsResponse'
 *       401:
 *         description: API key ausente o inválida
 *       500:
 *         description: Error interno
 */
router.post("/products/fix-urls", authApiKey, fixProductUrlsHandler);

export default router;
