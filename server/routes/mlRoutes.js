const express = require("express");

const {
  predictCrop,
  predictFertilizer,
  predictYield,
  predictPrice,
  predictDisease,
  predictGrowth,
} = require("../services/mlService");

const router = express.Router();

router.post("/crop", async (req, res) => {
  try {
    const result = await predictCrop(req.body);
    res.json(result);
  } catch (error) {
    console.error("Crop prediction error:", error.message);
    res.status(500).json({ message: "Crop prediction failed" });
  }
});

router.post("/fertilizer", async (req, res) => {
  try {
    const result = await predictFertilizer(req.body);
    res.json(result);
  } catch (error) {
    console.error("Fertilizer prediction error:", error.message);
    res.status(500).json({ message: "Fertilizer prediction failed" });
  }
});

router.post("/yield", async (req, res) => {
  try {
    const result = await predictYield(req.body);
    res.json(result);
  } catch (error) {
    console.error("Yield prediction error:", error.message);
    res.status(500).json({ message: "Yield prediction failed" });
  }
});

router.post("/price", async (req, res) => {
  try {
    const result = await predictPrice(req.body);
    res.json(result);
  } catch (error) {
    console.error("Price prediction error:", error.message);
    res.status(500).json({ message: "Price prediction failed" });
  }
});

router.post("/disease", async (req, res) => {
  try {
    const result = await predictDisease(req.body);
    res.json(result);
  } catch (error) {
    console.error("Disease prediction error:", error.message);
    res.status(500).json({ message: "Disease prediction failed" });
  }
});

router.post("/growth", async (req, res) => {
  try {
    const result = await predictGrowth(req.body);
    res.json(result);
  } catch (error) {
    console.error("Growth prediction error:", error.message);
    res.status(500).json({ message: "Growth prediction failed" });
  }
});

module.exports = router;
