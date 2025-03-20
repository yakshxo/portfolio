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
  // Theme switching state
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // State for managing search input and filtered skills
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSkills, setFilteredSkills] = useState(skillsData);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ✅ State for Weather Data
  const [weather, setWeather] = useState(null);

  // ✅ Fetch Weather Data from Netlify Function
  useEffect(() => {
    fetch("/.netlify/functions/api/weather")
      .then((response) => response.json())
      .then((data) => setWeather(data))
      .catch((error) => console.error("Error fetching weather:", error));
  }, []);

  // ✅ Filter skills based on search and category
  useEffect(() => {
    let filtered = skillsData.filter((skill) =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCategory !== "All") {
      filtered = filtered.filter((skill) => skill.category === selectedCategory);
    }

    setFilteredSkills(filtered);
  }, [searchTerm, selectedCategory]); 

  // Handle theme switch
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = theme;
  }, [theme]);

  return (
    <div className={`container mt-5 ${theme}`}>
      <h1 className="text-center">My Portfolio</h1>

      {/* Theme Toggle Button */}
      <div className="text-center">
        <button className="btn btn-primary mb-4" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          Toggle {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>

      {/* Weather Section */}
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

      {/* Skill Search Input */}
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

      {/* Display Filtered Skills */}
      <ul className="list-group">
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
    </div>
  );
}

export default App;