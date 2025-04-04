const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const sanitizeHtml = require("sanitize-html");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const router = express.Router();
const messagesFile = path.join(__dirname, "messages.json");

// GET Weather
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

// POST Contact Form
router.post("/contact", (req, res) => {
  const { name, email, subject, message, consent } = req.body;

  // Basic validation
  const nameRegex = /^[A-Za-zÀ-ÿ ,.'-]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const subjectRegex = /^[A-Za-z\s]+$/;

  if (
    !name || !email || !subject || !message || consent !== true ||
    !nameRegex.test(name) ||
    !emailRegex.test(email) ||
    !subjectRegex.test(subject) ||
    /[<>]/.test(message)
  ) {
    return res.status(400).json({ error: "Invalid or missing input fields." });
  }

  // Sanitize
  const sanitizedMessage = sanitizeHtml(message, { allowedTags: [], allowedAttributes: {} });

  const newMessage = {
    name: sanitizeHtml(name),
    email: sanitizeHtml(email),
    subject: sanitizeHtml(subject),
    message: sanitizedMessage,
    timestamp: new Date().toISOString()
  };

  let existingMessages = [];
  if (fs.existsSync(messagesFile)) {
    existingMessages = JSON.parse(fs.readFileSync(messagesFile));
  }

  existingMessages.push(newMessage);
  fs.writeFileSync(messagesFile, JSON.stringify(existingMessages, null, 2));

  res.json({ success: true, message: "Message stored successfully!" });
});

// GET All Messages
router.get("/messages", (req, res) => {
  if (fs.existsSync(messagesFile)) {
    const messages = JSON.parse(fs.readFileSync(messagesFile));
    return res.json(messages);
  }
  res.json([]);
});

app.use("/.netlify/functions/api", router);
module.exports = app;
module.exports.handler = serverless(app);
