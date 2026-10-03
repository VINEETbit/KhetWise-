const express = require("express");

const router = express.Router();

const validate = require("../middleware/validateMiddleware");

const {
  registerSchema,
  loginSchema,
} = require("../validations/userValidation");

const {
  createUser,
  loginUser,
  getUsers,
  getUserById,
} = require("../controllers/UserController");

const roleMiddleware = require("../middleware/roleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const loginLimiter = require("../middleware/rateLimiter");

// Register
router.post("/", validate(registerSchema), createUser);

// Login
router.post("/login", loginLimiter, validate(loginSchema), loginUser);

// Get all users - Admin only
router.get("/", authMiddleware, roleMiddleware("admin"), getUsers);

// Get user by ID
router.get("/:id", getUserById);

module.exports = router;
