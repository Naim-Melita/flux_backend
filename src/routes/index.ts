import { Router } from "express";
import { specs, swaggerUi } from "../swagger";
import productRoutes from "../modules/product/product.routes";
import authRoutes from "../modules/auth/auth.routes";


const router: Router = Router();

// Swagger UI
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Rutas
router.use("/products", productRoutes);

router.use("/auth", authRoutes);







export default router;
