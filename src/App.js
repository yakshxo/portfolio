import React, { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [weather, setWeather] = useState(null);
  const [messages, setMessages] = useState([]);

  const [formData, setFormData] = useState({
    name: localStorage.getItem("draftName") || "",
    email: localStorage.getItem("draftEmail") || "",
    subject: localStorage.getItem("draftSubject") || "",
    message: localStorage.getItem("draftMessage") || "",
    consent: localStorage.getItem("draftConsent") === "true"
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch("/.netlify/functions/api/weather")
      .then(res => res.json())
      .then(setWeather);

    fetch("/.netlify/functions/api/messages")
      .then(res => res.json())
      .then(setMessages);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    for (const key in formData) {
      localStorage.setItem(`draft${key.charAt(0).toUpperCase() + key.slice(1)}`, formData[key]);
    }
  }, [formData]);

  const validate = () => {
    const errs = {};
    if (!/^[A-Za-zÀ-ÿ ,.'-]+$/.test(formData.name)) errs.name = "Invalid name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Invalid email";
    if (!/^[A-Za-z\s]+$/.test(formData.subject)) errs.subject = "Subject must be letters only";
    if (/[<>]/.test(formData.message)) errs.message = "No HTML tags allowed";
    if (!formData.consent) errs.consent = "Consent is required";
    return errs;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: field === "consent" ? value.target.checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const response = await fetch("/.netlify/functions/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      setFormData({ name: "", email: "", subject: "", message: "", consent: false });
      localStorage.clear();
      fetch("/.netlify/functions/api/messages")
        .then(res => res.json())
        .then(setMessages);
    }
  };

  return (
    <div className={`container mt-5 ${theme}`}>
      <h1 className="text-center">My Portfolio</h1>

      <div className="text-center">
        <button className="btn btn-primary mb-4" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          Toggle {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>

      {weather && (
        <div className="weather-box text-center mb-4">
          <h3>Weather in {weather.city}</h3>
          <p>Temp: {weather.temperature}°C | Humidity: {weather.humidity}% | {weather.condition}</p>
        </div>
      )}

      <div className="container mb-5">
        <h2>Contact Me</h2>
        <form onSubmit={handleSubmit} noValidate>
          {["name", "email", "subject"].map((field) => (
            <div className="mb-3" key={field}>
              <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type={field === "email" ? "email" : "text"}
                className={`form-control ${errors[field] ? "is-invalid" : ""}`}
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                required
              />
              {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
            </div>
          ))}
          <div className="mb-3">
            <label className="form-label">Message</label>
            <textarea
              className={`form-control ${errors.message ? "is-invalid" : ""}`}
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              required
            />
            {errors.message && <div className="invalid-feedback">{errors.message}</div>}
          </div>
          <div className="form-check mb-3">
            <input
              className={`form-check-input ${errors.consent ? "is-invalid" : ""}`}
              type="checkbox"
              id="consent"
              checked={formData.consent}
              onChange={(e) => handleChange("consent", e)}
              required
            />
            <label className="form-check-label" htmlFor="consent">
              I consent to be contacted and my data to be stored securely.
            </label>
            {errors.consent && <div className="invalid-feedback d-block">{errors.consent}</div>}
          </div>
          <button type="submit" className="btn btn-success">Send</button>
        </form>
      </div>

      <div className="container mb-5">
        <h2>Messages</h2>
        {messages.length > 0 ? (
          <ul className="list-group">
            {messages.map((m, i) => (
              <li key={i} className="list-group-item">
                <strong>{m.name}</strong> - <em>{m.subject}</em><br />{m.message}
              </li>
            ))}
          </ul>
        ) : (
          <p>No messages yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;
