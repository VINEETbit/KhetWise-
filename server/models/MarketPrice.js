const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const marketPriceSchema = new Schema(
  {
    crop: {
      type: String,
      required: true,
    },

    market: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    district: {
      type: String,
    },

    minPrice: {
      type: Number,
    },

    maxPrice: {
      type: Number,
    },

    modalPrice: {
      type: Number,
    },

    unit: {
      type: String,
      default: "quintal",
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const MarketPrice = mongoose.model("MarketPrice", marketPriceSchema);

module.exports = MarketPrice;
