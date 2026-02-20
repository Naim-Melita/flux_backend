import { Request,Response } from "express";

export const errorHandler = (err : any, req :Request, res : Response, next : Function) => {
  console.error("ERROR:", err.stack);
  res.status(500).json({
    error: "Error interno del servidor",
    details: err.message
  });
};