const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

const farmRoutes = require("./routes/farmRoutes");
const soilRoutes = require("./routes/soilRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const marketPrice = require("./routes/marketPrice");
const cropsRoutes = require("./routes/cropsRoutes");
const AlertsRoutes = require("./routes/AlertsRoutes");
const userRoutes = require("./routes/userRoutes");
const notFound = require("./middleware/notFound");
const errorMiddleware = require("./middleware/errorMiddleware");
const mlRoutes = require("./routes/mlRoutes");

app.use("/api/farms", farmRoutes);
app.use("/api/soil", soilRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/MarketPrice", marketPrice);
app.use("/api/crops", cropsRoutes);
app.use("/api/alerts", AlertsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ml", mlRoutes);

app.get("/", (req, res) => {
  res.send("KhetWise API is running");
});

// MUST BE LAST
app.use(notFound);
app.use(errorMiddleware);

module.exports = app;
