import { Router } from "express";
import { specs, swaggerUi } from "../swagger";
import productRoutes from "../modules/product/product.routes";

const router: Router = Router();


// Swagger UI
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
router.use("/products", productRoutes);




export default router;
