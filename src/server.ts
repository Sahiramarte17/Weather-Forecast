// src/server.ts
import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { generateAnnouncerForecast } from './openai';

// Initialize dotenv to access .env variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// POST /forecast route
app.post('/forecast', async (req: Request, res: Response) => {
  const { location } = req.body;

  if (!location) {
    return res.status(400).json({ error: 'Location is required' });
  }

  try {
    // Fetch 5-day weather data from OpenWeather API
    const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/forecast`, {
      params: {
        q: location,
        units: 'metric',
        appid: process.env.OPENWEATHER_API_KEY
      }
    });

    const weatherData = weatherResponse.data;

    // Pass weather data to OpenAI to generate sports announcer forecast
    const forecast = await generateAnnouncerForecast(weatherData);

    return res.json({ location, forecast });
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching weather data or generating forecast' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
