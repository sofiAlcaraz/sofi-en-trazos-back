import express from "express";
import { getItems, createItems } from "../controllers/itemsController.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
export const itemsRoutes = express.Router();

itemsRoutes.get("/", getItems);
itemsRoutes.post("/create", requireAdmin, createItems);
