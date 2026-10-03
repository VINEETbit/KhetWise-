const MarketPrice = require("../models/MarketPrice");

const createMarketPrice = async (req, res) => {
  try {
    const marketPrice = new MarketPrice(req.body);

    await marketPrice.save();

    res.status(201).json({
      success: true,
      marketPrice,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getMarketPrices = async (req, res) => {
  try {
    console.log("1. GET MarketPrice started");

    const marketPrices = await MarketPrice.find({});

    console.log("2. MongoDB query completed");
    console.log("3. Data:", marketPrices);

    res.json({
      success: true,
      marketPrices,
    });
  } catch (err) {
    console.log("ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createMarketPrice,
  getMarketPrices,
};
