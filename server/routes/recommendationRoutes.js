const express = require("express");
const router = express.Router();

const {
  createRecommendation,
  getRecommendations,
} = require("../controllers/RecommendationController");

const authMiddleware = require("../middleware/authMiddleware");
const checkFarmOwnership = require("../middleware/checkFarmOwnership");

const validate = require("../middleware/validateMiddleware");
const recommendationSchema = require("../validations/recommendationValidation");

router.post(
  "/",
  authMiddleware,
  validate(recommendationSchema),
  createRecommendation,
);

router.get("/:farmId", authMiddleware, checkFarmOwnership, getRecommendations);

module.exports = router;