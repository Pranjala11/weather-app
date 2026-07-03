const express = require('express');
const axios = require('axios');
const router = express.Router();
const SearchHistory = require('../models/SearchHistory');

// Search by city name
router.get('/', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          q: city,
          appid: process.env.OPENWEATHER_API_KEY,
          units: 'metric'
        }
      }
    );

    await SearchHistory.findOneAndUpdate(
      { city: city.toLowerCase() },
      { city: city.toLowerCase(), searchedAt: Date.now() },
      { upsert: true, new: true }
    );

    res.json(response.data);

  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: 'City not found' });
    }
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Search by GPS coordinates
router.get('/coords', async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          lat,
          lon,
          appid: process.env.OPENWEATHER_API_KEY,
          units: 'metric'
        }
      }
    );

    await SearchHistory.findOneAndUpdate(
      { city: response.data.name.toLowerCase() },
      { city: response.data.name.toLowerCase(), searchedAt: Date.now() },
      { upsert: true, new: true }
    );

    res.json(response.data);

  } catch (err) {
    res.status(500).json({ error: 'Could not fetch weather by location' });
  }
});

module.exports = router;