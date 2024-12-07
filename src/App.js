import React, { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader"; // Import the spinner
import './App.css';

const App = () => {
  const [cities, setCities] = useState(""); // Input for multiple cities
  const [citiesWeather, setCitiesWeather] = useState([]); // Store weather data for multiple cities
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("light");

  const fetchWeatherForMultipleCities = async (citiesList) => {
    try {
      setError("");
      setCitiesWeather([]); // Reset cities weather data
      setLoading(true);

      const apiKey = "c78fdb4aaec9be91f89e9f6e56afbc97";

      // Loop through each city and fetch the weather
      const weatherPromises = citiesList.map(async (city) => {
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&units=metric&appid=${apiKey}`
        );
        if (!weatherResponse.ok) {
          throw new Error(`Weather data for ${city} not available`);
        }
        const weatherData = await weatherResponse.json();
        return weatherData;
      });

      // Wait for all weather data to be fetched
      const weatherDataArray = await Promise.all(weatherPromises);
      setCitiesWeather(weatherDataArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme); // Update the theme on the document
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Weather App for Multiple Cities</h1>

      {/* Theme Toggle Button */}
      <button onClick={toggleTheme} style={{ marginBottom: "20px" }}>
        Toggle {theme === "light" ? "Dark" : "Light"} Mode
      </button>

      {/* Input field for multiple cities */}
      <input
        type="text"
        placeholder="Enter cities (comma separated)"
        value={cities}
        onChange={(e) => setCities(e.target.value)}
        style={{ padding: "10px", fontSize: "16px" }}
      />
      <button onClick={() => fetchWeatherForMultipleCities(cities.split(","))} style={{ padding: "10px", marginLeft: "10px" }}>
        Get Weather
      </button>

      {loading && <ClipLoader color="#0077cc" size={50} />} {/* Loading spinner */}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display weather data in grid */}
      <div className="weather-grid">
        {citiesWeather.map((weather, index) => (
          <div key={index} className="weather-card">
            <h3>{weather.name}</h3>
            <p>Temperature: {weather.main.temp}°C</p>
            <p>Condition: {weather.weather[0].description}</p>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              style={{ marginTop: "10px" }}
            />
            <p>Humidity: {weather.main.humidity}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
