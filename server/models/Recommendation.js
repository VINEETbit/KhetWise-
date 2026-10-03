const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recommendationSchema = new Schema(
  {
    farmer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    farm: {
      type: Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
    },

    type: {
      type: String,
      enum: ["crop", "fertilizer", "irrigation", "disease", "yield"],
      required: true,
    },

    recommendation: {
      type: String,
      required: true,
    },

    confidence: {
      type: Number,
    },

    reason: {
      type: String,
    },

    inputData: {
      nitrogen: Number,
      phosphorus: Number,
      potassium: Number,
      ph: Number,
      temperature: Number,
      humidity: Number,
      rainfall: Number,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const Recommendation = mongoose.model("Recommendation", recommendationSchema);

module.exports = Recommendation;
