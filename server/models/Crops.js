const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cropSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    scientificName: {
      type: String,
    },

    season: {
      type: String,
      enum: ["kharif", "rabi", "zaid", "all"],
    },

    suitableSoil: [
      {
        type: String,
      },
    ],

    minTemperature: {
      type: Number,
    },

    maxTemperature: {
      type: Number,
    },

    waterRequirement: {
      type: String,
      enum: ["low", "medium", "high"],
    },

    duration: {
      type: Number,
    },

    description: {
      type: String,
    },

    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Crop = mongoose.model("Crop", cropSchema);

module.exports = Crop;
