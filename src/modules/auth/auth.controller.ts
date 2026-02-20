import { Request, Response } from "express";
import { login, register } from "./auth.service";

export async function loginHandler(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ error: "Fields are required" });
    }
    const result = await login({ email, password });
    return res.json(result);
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }
}

export async function registerHandler(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { name, last_name, email, password } = req.body ?? {};

    if (!email || !password || !name || !last_name) {
      return res.status(400).json({ error: "Fields are required" });
    }

    const result = await register({ name, email, last_name, password });
    return res.json(result);
  } catch (error: any) {
    return res.status(409).json({ error: error.message });
  }
}
