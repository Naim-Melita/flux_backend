import { prisma } from "../lib/prisma";

export default async function connectDB() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL no configurada");
    }
    await prisma.$connect();
    console.log("Connected to PostgreSQL (Prisma)");
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
  }
}
