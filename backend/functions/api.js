const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const router = express.Router();

// In-memory message store
let messages = [];

//Weather API
router.get("/weather", async (req, res) => {
  const apiKey = process.env.WEATHER_API_KEY;
  const city = "Halifax";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
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

router.post("/contact", (req, res) => {
  const { name, email, message, subject, consent } = req.body;

  // Simple validation
  if (!name || !email || !message || !subject || consent !== true) {
    return res.status(400).json({ error: "All fields and consent are required." });
  }

  // Basic sanitation
  const sanitize = (str) =>
    str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();

  const newMessage = {
    name: sanitize(name),
    email: sanitize(email),
    subject: sanitize(subject),
    message: sanitize(message),
    timestamp: new Date().toISOString(),
  };

  messages.push(newMessage);
  res.json({ success: true, message: "Message saved!" });
});

router.get("/messages", (req, res) => {
  res.json(messages);
});

app.use("/.netlify/functions/api", router);
module.exports = app;
module.exports.handler = serverless(app);
