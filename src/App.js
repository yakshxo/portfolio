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
  const [filteredSkills, setFilteredSkills] = useState(skillsData);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [weather, setWeather] = useState(null);

  const [formData, setFormData] = useState({
    name: localStorage.getItem("draftName") || "",
    email: localStorage.getItem("draftEmail") || "",
    message: localStorage.getItem("draftMessage") || ""
  });

  const [submissions, setSubmissions] = useState([]); // 🔥 NEW

  // Load weather
  useEffect(() => {
    fetch("/.netlify/functions/api/weather")
      .then((res) => res.json())
      .then((data) => setWeather(data))
      .catch((err) => console.error("Weather fetch error:", err));
  }, []);

  // Load stored messages
  useEffect(() => {
    fetch("/.netlify/functions/api/contact")
      .then((res) => res.json())
      .then((data) => setSubmissions(data.reverse())) // Most recent first
      .catch((err) => console.error("Fetch messages error:", err));
  }, []);

  // Filter skills
  useEffect(() => {
    let filtered = skillsData.filter((skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCategory !== "All") {
      filtered = filtered.filter((skill) => skill.category === selectedCategory);
    }

    setFilteredSkills(filtered);
  }, [searchTerm, selectedCategory]);

  // Theme effect
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = theme;
  }, [theme]);

  // Draft saver
  const updateForm = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    localStorage.setItem(`draft${field.charAt(0).toUpperCase() + field.slice(1)}`, value);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/.netlify/functions/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Message sent!");
        setFormData({ name: "", email: "", message: "" });
        localStorage.removeItem("draftName");
        localStorage.removeItem("draftEmail");
        localStorage.removeItem("draftMessage");

        const updated = await fetch("/.netlify/functions/api/contact").then(res => res.json());
        setSubmissions(updated.reverse());
      } else {
        alert("Error sending message.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Server error.");
    }
  };

  return (
    <div className={`container mt-5 ${theme}`}>
      <h1 className="text-center">My Portfolio</h1>

      {/* Theme Switch */}
      <div className="text-center">
        <button className="btn btn-primary mb-4" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          Toggle {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>

      {/* Weather Info */}
      {weather ? (
        <div className="weather-box text-center mb-4">
          <h3>Weather in {weather.city}</h3>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Humidity: {weather.humidity}%</p>
          <p>Condition: {weather.condition}</p>
        </div>
      ) : (
        <p className="text-center">Loading weather...</p>
      )}

      {/* Skill Search */}
      <div className="text-center">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="text-center">
        <select className="form-select mb-3" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Design">Design</option>
        </select>
      </div>

      {/* Skill List */}
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

      {/* Contact Form */}
      <div className="container mb-5">
        <h2>Contact Me</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={formData.name}
              onChange={(e) => updateForm("name", e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={formData.email}
              onChange={(e) => updateForm("email", e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea
              id="message"
              className="form-control"
              rows="4"
              value={formData.message}
              onChange={(e) => updateForm("message", e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-success">Send</button>
        </form>
      </div>

      {/* 🔥 Message Display */}
      <div className="container mb-5">
        <h2>Contact Messages</h2>
        {submissions.length > 0 ? (
          <ul className="list-group">
            {submissions.map((entry, i) => (
              <li key={i} className="list-group-item">
                <strong>{entry.name}</strong> ({entry.email}): {entry.message}
              </li>
            ))}
          </ul>
        ) : (
          <p>No messages submitted yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;
