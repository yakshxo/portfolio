import React, { useState, useEffect } from "react";
import "./index.css";

const skillsData = [
  { name: "HTML", category: "Frontend" },
  { name: "CSS", category: "Frontend" },
  { name: "JavaScript", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Express", category: "Backend" },
  { name: "MongoDB", category: "Backend" },
  { name: "UI/UX Design", category: "Design" },
  { name: "Figma", category: "Design" },
];

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredSkills, setFilteredSkills] = useState(skillsData);
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
      .then((res) => res.json())
      .then(setWeather)
      .catch((err) => console.error("Weather error", err));

    fetch("/.netlify/functions/api/messages")
      .then((res) => res.json())
      .then(setMessages)
      .catch((err) => console.error("Messages error", err));
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("draftName", formData.name);
    localStorage.setItem("draftEmail", formData.email);
    localStorage.setItem("draftSubject", formData.subject);
    localStorage.setItem("draftMessage", formData.message);
    localStorage.setItem("draftConsent", formData.consent.toString());
  }, [formData]);

  useEffect(() => {
    let filtered = skillsData.filter((skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedCategory !== "All") {
      filtered = filtered.filter((skill) => skill.category === selectedCategory);
    }
    setFilteredSkills(filtered);
  }, [searchTerm, selectedCategory]);

  const validate = () => {
    const errs = {};
    if (!/^[A-Za-zÀ-ÿ ,.'-]+$/.test(formData.name)) errs.name = "Invalid name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Invalid email";
    if (!/^[A-Za-z\s]+$/.test(formData.subject)) errs.subject = "Letters only";
    if (/[<>]/.test(formData.message)) errs.message = "HTML tags not allowed";
    if (!formData.consent) errs.consent = "Consent is required";
    return errs;
  };


  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "consent" ? value.target.checked : value,
    }));
  };

  // 📬 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const res = await fetch("/.netlify/functions/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Message sent!");
        setFormData({ name: "", email: "", subject: "", message: "", consent: false });
        localStorage.clear();
        const updated = await fetch("/.netlify/functions/api/messages").then((r) => r.json());
        setMessages(updated);
      } else {
        alert("Error sending message.");
      }
    } catch (err) {
      console.error("Submit error", err);
      alert("Server error.");
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
        <div className="text-center mb-4">
          <h3>Weather in {weather.city}</h3>
          <p>{weather.temperature}°C, {weather.humidity}% humidity, {weather.condition}</p>
        </div>
      )}

      <div className="text-center">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="form-select mb-3" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Design">Design</option>
        </select>
      </div>

      {/* 💻 Skills */}
      <ul className="list-group mb-5">
        {filteredSkills.length > 0 ? (
          filteredSkills.map((skill, index) => (
            <li key={index} className="list-group-item">
              {skill.name} - <strong>{skill.category}</strong>
            </li>
          ))
        ) : (
          <li className="list-group-item text-center">No skills found</li>
        )}
      </ul>

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
              I consent to be contacted and my data stored securely.
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
            {messages.map((msg, index) => (
              <li key={index} className="list-group-item">
                <strong>{msg.name}</strong> - <em>{msg.subject}</em><br />
                {msg.message}
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