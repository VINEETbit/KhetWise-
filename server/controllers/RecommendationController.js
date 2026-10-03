const Recommendation = require("../models/Recommendation");
const Farm = require("../models/Farm");


const createRecommendation = async (req, res) => {
  try {
    const { farmer, farm } = req.body;

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

    const recommendation = new Recommendation({
      ...req.body,
      farmer: req.user.id,
    });

    await recommendation.save();

    res.status(201).json({
      success: true,
      recommendation,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.find({
      farm: req.params.farmId,
    });

    res.json({
      success: true,
      recommendations,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createRecommendation,
  getRecommendations,
};
