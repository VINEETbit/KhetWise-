const SoilData = require("../models/SoilData");

// Create soil data
const Farm = require("../models/Farm");

const createSoilData = async (req, res) => {
  try {
    const { farm } = req.body;

    // Check that this farm belongs to logged-in farmer
    const farmExists = await Farm.findOne({
      _id: farm,
      farmer: req.user.id,
    });

    if (!farmExists) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this farm",
      });
    }

    const soilData = new SoilData(req.body);

    await soilData.save();

    res.status(201).json({
      success: true,
      soilData,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get soil data for a specific farm
const getSoilData = async (req, res) => {
  try {
    const soilData = await SoilData.find({
      farm: req.params.farmId,
    });

    res.json({
      success: true,
      soilData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createSoilData,
  getSoilData,
};
