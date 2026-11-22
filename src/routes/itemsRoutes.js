const express = require("express");
const router = express.Router();
const { getItems, createItems } = require("../controllers/itemsController");

router.get("/", getItems);
router.post("/create", createItems);

module.exports = router;
