import dotenv from "dotenv";
dotenv.config();
import path from 'path';

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import barcodeRoutes from "./routes/barcode.routes.js";
import { swaggerUi, specs } from "./swagger.js";
import { errorHandler } from "./middleware/errorHandler.js"; // lo creamos abajo
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// Logs de variables de entorno
console.log("AUTH_API_KEY:", process.env.AUTH_API_KEY);
console.log("CLOUD_NAME:", process.env.CLOUD_NAME);
console.log("CLOUD_API_KEY:", process.env.CLOUD_API_KEY);
console.log("CLOUD_API_SECRET:", process.env.CLOUD_API_SECRET);
console.log("AUTH_API_KEY cargada:", process.env.AUTH_API_KEY);

const app = express();
// Para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
// Middlewares globales
app.use(helmet()); // 🔒 cabeceras de seguridad
app.use(cors({
  origin: "*", // luego tu dominio real del front
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "x-api-key"]
}));
app.use(express.json());


// Rate limiting (máx 100 requests cada 15 min por IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Demasiadas solicitudes desde esta IP, intenta más tarde."
});
app.use(limiter);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado 🚀"))
  .catch((err) => console.error("❌ Error al conectar MongoDB:", err));

// Rutas API
app.use("/api/barcodes", barcodeRoutes);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Middleware de manejo centralizado de errores
app.use(errorHandler);

// Puerto desde .env o fallback
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API SaaS de códigos corriendo en puerto ${PORT} 🚀`);
  console.log(`📖 Swagger docs disponibles en http://localhost:${PORT}/api-docs`);
});