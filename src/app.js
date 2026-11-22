const express = require("express");
const cors = require("cors");
const itemsRoutes = require("./routes/itemsRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Rutas
app.use("/api/items", itemsRoutes);

module.exports = app;
