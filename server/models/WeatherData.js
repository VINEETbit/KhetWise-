const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const weatherDataSchema = new Schema(
  {
    farm: {
      type: Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
    },

    temperature: {
      type: Number,
    },

    humidity: {
      type: Number,
    },

    rainfall: {
      type: Number,
    },

    windSpeed: {
      type: Number,
    },

    pressure: {
      type: Number,
    },

    weatherCondition: {
      type: String,
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

const WeatherData = mongoose.model("WeatherData", weatherDataSchema);

module.exports = WeatherData;
