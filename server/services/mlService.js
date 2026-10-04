const axios = require("axios");

const ML_URL = process.env.ML_SERVICE_URL || "http://127.0.0.1:8000";

async function predictCrop(data) {
  const response = await axios.post(`${ML_URL}/predict/crop`, data);
  return response.data;
}

async function predictFertilizer(data) {
  const response = await axios.post(`${ML_URL}/predict/fertilizer`, data);
  return response.data;
}

async function predictYield(data) {
  const response = await axios.post(`${ML_URL}/predict/yield`, data);
  return response.data;
}

async function predictPrice(data) {
  const response = await axios.post(`${ML_URL}/predict/price`, data);
  return response.data;
}

async function predictDisease(data) {
  const response = await axios.post(`${ML_URL}/predict/disease`, data);
  return response.data;
}

async function predictGrowth(data) {
  const response = await axios.post(`${ML_URL}/predict/growth`, data);
  return response.data;
}

module.exports = {
  predictCrop,
  predictFertilizer,
  predictYield,
  predictPrice,
  predictDisease,
  predictGrowth,
};
