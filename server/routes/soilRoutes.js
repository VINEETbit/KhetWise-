const express = require("express");
const router = express.Router();

const {
  createSoilData,
  getSoilData,
} = require("../controllers/SoilController");

const authMiddleware = require("../middleware/authMiddleware");
const checkFarmOwnership = require("../middleware/checkFarmOwnership");

const validate = require("../middleware/validateMiddleware");
const soilSchema = require("../validations/soilValidation");

router.post("/", authMiddleware, validate(soilSchema), createSoilData);

router.get("/:farmId", authMiddleware, checkFarmOwnership, getSoilData);

module.exports = router;
