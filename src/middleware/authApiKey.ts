import { Request, Response, NextFunction } from "express";

// middleware/authApiKey.js
export const authApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) {
    return res.status(401).json({ error: "API Key requerida" });
  }
  if (apiKey !== process.env.AUTH_API_KEY) {
    return res.status(401).json({
      message: `Unknown API key ${apiKey}`,
      http_code: 401,
    });
  }
  next();
};
