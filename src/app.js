import express from "express";
import cors from "cors";
import { itemsRoutes } from "./routes/itemsRoutes.js";
export const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Rutas
app.use("/api/items", itemsRoutes);
