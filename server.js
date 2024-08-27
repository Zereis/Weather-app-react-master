const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());  // Tillåter CORS för att frontend ska kunna göra anrop till backend

const apiKey = 'f97ef50d255f411a64f802719315b8aa';

app.get('/api/weather', async (req, res) => {
    const location = req.query.location;
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=imperial&appid=${apiKey}`;

    try {
        const currentWeatherResponse = await axios.get(currentWeatherUrl);
        const forecastResponse = await axios.get(forecastUrl);
        res.json({
            currentWeather: currentWeatherResponse.data,
            forecast: forecastResponse.data.list,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
