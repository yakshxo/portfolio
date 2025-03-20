const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch"); // Version 2 for compatibility

dotenv.config();
const app = express();
app.use(cors());

const router = express.Router();

// ✅ API to get a list of projects
router.get("/projects", (req, res) => {
  const projects = [
    { id: 1, name: "Portfolio Website", author: "Harshil", languages: ["React", "CSS"], description: "A personal portfolio." },
    { id: 2, name: "E-commerce App", author: "Harshil", languages: ["Node.js", "MongoDB"], description: "A full-stack e-commerce platform." },
    { id: 3, name: "Weather App", author: "Harshil", languages: ["JavaScript", "API"], description: "Fetches real-time weather data." },
  ];
  res.json(projects);
});

// ✅ API to get weather information
router.get("/weather", async (req, res) => {
  const apiKey = process.env.WEATHER_API_KEY;
  const city = "Halifax"; // You can later make this dynamic

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const weatherData = await response.json();

    // Extract necessary details
    const weatherInfo = {
      city: weatherData.name,
      temperature: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      condition: weatherData.weather[0].description,
    };

    res.json(weatherInfo);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// ✅ Register routes
app.use("/.netlify/functions/api", router);

module.exports = app;
module.exports.handler = serverless(app);