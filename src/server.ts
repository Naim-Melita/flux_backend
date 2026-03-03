import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db";
import router from "./routes/index";
import { errorHandler } from "./middleware/errorHandler";
dotenv.config();

console.log("AUTH_API_KEY cargada:", Boolean(process.env.AUTH_API_KEY));
console.log("DATABASE_URL cargada:", Boolean(process.env.DATABASE_URL));

const server = express();

server.use(helmet()); // 🔒 cabeceras de seguridad
server.use(cors({
  origin: "*", // luego tu dominio real del front
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "x-api-key"]
}));
server.use(express.json());


// Rate limiting (máx 100 requests cada 15 min por IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Demasiadas solicitudes desde esta IP, intenta más tarde."
});
server.use(limiter);

// Conexión a PostgreSQL via Prisma
connectDB();

// Rutas API
server.use(router);


// Middleware de manejo centralizado de errores
server.use(errorHandler);

// Puerto desde .env o fallback
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`API SaaS de códigos corriendo en puerto ${PORT} 🚀`);
  console.log(`📖 Swagger docs disponibles en http://localhost:${PORT}/api-docs`);
});
