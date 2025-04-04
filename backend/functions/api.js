const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch"); // Version 2

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const router = express.Router();

// ✅ GET Weather
router.get("/weather", async (req, res) => {
  const apiKey = process.env.WEATHER_API_KEY;
  const city = "Halifax";

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();

    const weatherInfo = {
      city: data.name,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      condition: data.weather[0].description,
    };

    res.json(weatherInfo);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// ✅ POST Contact Form
router.post("/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const filePath = path.join(__dirname, "messages.json");

  let existingMessages = [];
  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath);
    existingMessages = JSON.parse(rawData);
  }

  const newMessage = { name, email, message, timestamp: new Date().toISOString() };
  existingMessages.push(newMessage);
  fs.writeFileSync(filePath, JSON.stringify(existingMessages, null, 2));

  res.json({ success: true, message: "Message received!" });
});

// ✅ GET All Messages
router.get("/messages", (req, res) => {
  const filePath = path.join(__dirname, "messages.json");

  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath);
    const messages = JSON.parse(rawData);
    return res.json(messages);
  } else {
    return res.json([]);
  }
});

app.use("/.netlify/functions/api", router);
module.exports = app;
module.exports.handler = serverless(app);
