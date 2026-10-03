const Farm = require("../models/Farm");

// Create Farm
const createFarm = async (req, res) => {
  try {
    const { name, location, area, soilType, crop } = req.body;

    const farm = new Farm({
      name,
      location,
      area,
      soilType,
      crop,
      farmer: req.user.id,
    });

    await farm.save();

    res.status(201).json({
      success: true,
      farm,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get only logged-in user's farms
const getFarms = async (req, res) => {
  try {
    const farms = await Farm.find({
      farmer: req.user.id,
    });

    res.json({
      success: true,
      farms,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createFarm,
  getFarms,
};
