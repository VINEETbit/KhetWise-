const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const soilDataSchema = new Schema(
  {
    farm: {
      type: Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
    },

    nitrogen: {
      type: Number,
    },

    phosphorus: {
      type: Number,
    },

    potassium: {
      type: Number,
    },

    ph: {
      type: Number,
    },

    moisture: {
      type: Number,
    },

    temperature: {
      type: Number,
    },

    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const SoilData = mongoose.model("SoilData", soilDataSchema);

module.exports = SoilData;
