const express = require("express");

const router = express.Router();

const {
  createMarketPrice,
  getMarketPrices,
} = require("../controllers/MarketPrice");

const authMiddleware = require("../middleware/authMiddleware");


router.post("/",authMiddleware, createMarketPrice);

router.get("/", authMiddleware,getMarketPrices);

module.exports = router;
