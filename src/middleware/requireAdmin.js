import express from "express";
import { auth } from "../config/firebase.js";

const app = express();
app.use(express.json());

export async function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ error: "No autenticado: falta el token Bearer" });
  }

  try {
    // Verifica que el token sea real, no haya expirado y pertenezca a tu proyecto

    const decoded = await auth.verifyIdToken(token);

    req.user = decoded; // { uid, email, name, ... }
    return next();
  } catch (err) {
    console.error("Error verifyIdToken:", err.code, err.message);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}
