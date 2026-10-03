const Weather = require("../models/WeatherData");
const Farm = require("../models/Farm");

// Create Weather Data
const createWeatherData = async (req, res) => {
  try {
    const { farm } = req.body;

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

    const weather = new Weather(req.body);

    await weather.save();

    res.status(201).json({
      success: true,
      weather,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Weather Data
const getWeather = async (req, res) => {
  try {
    const weather = await Weather.find({
      farm: req.params.farmId,
    }).sort({ recordedAt: -1 });

    res.json({
      success: true,
      weather,
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
  createWeatherData,
  getWeather,
};
