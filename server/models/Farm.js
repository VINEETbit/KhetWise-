const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const farmSchema = new Schema(
  {
    farmer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      
    },

    name: {
      type: String,
      required: true,
    },

    area: {
      type: Number,
      required: true,
    },

    location: {
      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },

      address: {
        type: String,
      },
    },

    soilType: {
      type: String,
      enum: [
        "alluvial",
        "black",
        "red",
        "laterite",
        "desert",
        "mountain",
        "Loamy",
        "other",
      ],
    },

    irrigationType: {
      type: String,
      enum: ["rainfed", "canal", "Drip", "sprinkler", "borewell", "other"],
    },

    currentCrop: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Farm = mongoose.model("Farm", farmSchema);

module.exports = Farm;
