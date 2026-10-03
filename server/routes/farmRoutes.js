const express = require("express");
const router = express.Router();

const { createFarm, getFarms } = require("../controllers/FarmController");

const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");

const farmSchema = require("../validations/farmValidation");

router.post("/", authMiddleware, validate(farmSchema), createFarm);

router.get("/", authMiddleware, getFarms);

module.exports = router;
