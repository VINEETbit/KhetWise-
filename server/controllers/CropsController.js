const Crops = require("../models/Crops");

// Create Crop
const createCrop = async (req, res) => {
  try {
    const crop = new Crops(req.body);

    await crop.save();

    res.status(201).json({
      success: true,
      crop,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get All Crops
const getCrops = async (req, res) => {
  try {
    const crops = await Crops.find({});

    res.json({
      success: true,
      crops,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Single Crop
const getCropById = async (req, res) => {
  try {
    const crop = await Crops.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: "Crop not found",
      });
    }

    res.json({
      success: true,
      crop,
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
  createCrop,
  getCrops,
  getCropById,
};
