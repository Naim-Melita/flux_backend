// middleware/authApiKey.js
export const authApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  console.log("Header recibido:", apiKey);
  console.log("AUTH_API_KEY esperado:", process.env.AUTH_API_KEY);

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