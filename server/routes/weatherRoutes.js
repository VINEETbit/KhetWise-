const express = require("express");

const router = express.Router();

const {
  createWeatherData,
  getWeather,
} = require("../controllers/WeatherController");

const authMiddleware = require("../middleware/authMiddleware");
const checkFarmOwnership = require("../middleware/checkFarmOwnership");

const validate = require("../middleware/validateMiddleware");
const weatherSchema = require("../validations/weatherValidation");

router.post("/", authMiddleware, validate(weatherSchema), createWeatherData);

router.get("/:farmId", authMiddleware, checkFarmOwnership, getWeather);

module.exports = router;
