const express = require("express");
const router = express.Router();
const roleMiddleware = require("../middleware/roleMiddleware");

const {
    createAlert,
    getAlerts,
    getFarmAlerts,
    deleteAlert
} = require("../controllers/AlertsController");

const authMiddleware = require("../middleware/authMiddleware");
const checkFarmOwnership = require("../middleware/checkFarmOwnership");

// Create alert
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "expert"),
  createAlert,
);

// Get logged-in user's alerts
router.get(
  "/",
  authMiddleware,
  getAlerts
);

// Get alerts for a specific farm
router.get(
  "/farm/:farmId",
  authMiddleware,
  checkFarmOwnership,
  getFarmAlerts
);

// Delete alert
router.delete(
  "/:id",
  authMiddleware,
  deleteAlert
);

module.exports = router;