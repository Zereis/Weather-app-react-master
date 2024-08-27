import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloud, faCloudShowersHeavy, faSnowflake, faBolt, faWind } from '@fortawesome/free-solid-svg-icons';

function App() {
  // State hooks
  const [data, setData] = useState({});
  const [forecastData, setForecastData] = useState([]);
  const [location, setLocation] = useState('');

  // Current date and day of the week
  const currentDate = new Date();
  const currentDayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(currentDate);

// Ta bort dessa linjer från din React-app eftersom de nu hanteras av backend
// const apiKey = 'f97ef50d255f411a64f802719315b8aa';
// const getCurrentWeatherUrl = (location) =>
//   `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${apiKey}`;
// const getForecastUrl = (location) =>
//   `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=imperial&appid=${apiKey}`;

  // Function to search for weather data when Enter key is pressed
  const searchLocation = async (event) => {
    if (event.key === 'Enter') {
      try {
        // Anropa din backend server för väderdata
        const response = await axios.get(`http://localhost:3001/api/weather`, {
          params: { location }
        });
        
        // Spara den mottagna datan
        setData(response.data.currentWeather);
        setForecastData(response.data.forecast);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setLocation('didnt work');
      }

      // Töm inmatningsfältet efter sökning
      setLocation('');
    }
  };

  // Function to convert Fahrenheit to Celsius
  const fahrenheitToCelsius = (fahrenheit) => ((fahrenheit - 32) * 5) / 9;

    // Function to get weather icon based on weather description
  const getWeatherIcon = (weatherDescription) => {
    const lowerCaseDescription = weatherDescription.toLowerCase();

    switch (lowerCaseDescription) {
      case 'clear':
        return <FontAwesomeIcon icon={faSun} />;
      case 'clouds':
        return <FontAwesomeIcon icon={faCloud} />;
      case 'rain':
        return <FontAwesomeIcon icon={faCloudShowersHeavy} />;
      case 'snow':
        return <FontAwesomeIcon icon={faSnowflake} />;
      case 'thunderstorm':
        return <FontAwesomeIcon icon={faBolt} />;
      default:
        return <FontAwesomeIcon icon={faWind} />;
    }
  };
  // Function to render the forecast
  const renderForecast = () => {
    // Group forecast data by date
    const groupedForecast = forecastData.reduce((acc, forecast) => {
      const forecastDate = new Date(forecast.dt * 1000);
  
      // Add one day to the forecast date
      forecastDate.setDate(forecastDate.getDate() + 1);
  
      const date = forecastDate.toLocaleDateString('en-US');
  
      if (!acc[date]) {
        acc[date] = forecast;
      }
  
      // Include forecast data for the next 6 days
      if (Object.keys(acc).length <= 6) {
        acc[date] = forecast;
      }
  
      return acc;
    }, {});
  
    // Map through the grouped forecast data and display entries
// Map through the grouped forecast data and display entries
return Object.keys(groupedForecast).map((date, index) => {
  const forecast = groupedForecast[date];

  // Adjust dayOfWeek to start from tomorrow
  const forecastDate = new Date(forecast.dt * 1000);
  forecastDate.setDate(forecastDate.getDate() + 1);

  const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(forecastDate);

  return (
    <div key={index} className="forecast-day">
      <p>{dayOfWeek}</p>
      <div className="temp">
        <p>{fahrenheitToCelsius(forecast.main.temp).toFixed()}°C</p>
      </div>
      <div className="icon">{getWeatherIcon(forecast.weather[0].main)}</div>
    </div>
  );
});

  };
  
  

  // Render the main component
  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location"
          type="text"
        />
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            {data.name && (
              <p>
                {data.name} - {currentDayOfWeek}
              </p>
            )}
          </div>
          <div className="temp">{data.main && <h1>{fahrenheitToCelsius(data.main.temp).toFixed()}°C</h1>}</div>
          <div className="description">{data.weather && <p>{data.weather[0].main}</p>}</div>
        </div>

        {data.name !== undefined && (
          <>
            <div className="forecast">{forecastData.length > 0 && renderForecast()}</div>
            <div className="bottom">
              <div className="feels">
                {data.main && <p className="bold">{fahrenheitToCelsius(data.main.feels_like).toFixed()}°C</p>}
                <p>Feels Like</p>
              </div>
              <div className="humidity">{data.main && <p className="bold">{data.main.humidity}% </p>}<p>humidity</p></div>
              <div className="wind">{data.wind && <p className="bold">{data.wind.speed.toFixed()} MPH</p>}<p>Wind speed</p></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
