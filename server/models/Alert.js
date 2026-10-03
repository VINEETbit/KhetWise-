const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const alertSchema = new Schema(
  {
    farmer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    farm: {
      type: Schema.Types.ObjectId,
      ref: "Farm",
    },

    type: {
      type: String,
      enum: ["weather", "disease", "irrigation", "market", "general"],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Alert = mongoose.model("Alert", alertSchema);

module.exports = Alert;
