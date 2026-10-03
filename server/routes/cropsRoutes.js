const express = require("express");
const router = express.Router();

const {
    createCrop,
    getCrops,
    getCropById,
} = require("../controllers/CropsController");

router.post("/", createCrop);
router.get("/", getCrops);
router.get("/:id", getCropById);

module.exports = router;