
// Create Alert;
const Alert = require("../models/Alert");
const Farm = require("../models/Farm");

const createAlert = async (req, res) => {
  try {
    const { farm } = req.body;

    // If alert is connected to a farm, verify ownership
    if (farm) {
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
    }

    const alert = new Alert({
      ...req.body,
      farmer: req.user.id,
    });

    await alert.save();

    res.status(201).json({
      success: true,
      alert,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get All Alerts
const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({}).sort({ createdAt: -1 });

    res.json({
      success: true,
      alerts,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Alerts for a Farm
const getFarmAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({
      farm: req.params.farmId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      alerts,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete Alert
const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    res.json({
      success: true,
      message: "Alert deleted successfully",
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
  createAlert,
  getAlerts,
  getFarmAlerts,
  deleteAlert,
};
