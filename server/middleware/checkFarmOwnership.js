const Farm = require("../models/Farm");

const checkFarmOwnership = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({
      _id: req.params.farmId,
      farmer: req.user.id,
    });

    if (!farm) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this farm",
      });
    }

    req.farm = farm;
    next();
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = checkFarmOwnership;
