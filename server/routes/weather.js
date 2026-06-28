const express = require('express');
const axios = require('axios');
const router = express.Router();
const SearchHistory = require('../models/SearchHistory');

router.get('/', async (req, res) => {
  const { city } = req.query;

  console.log('City received:', city);
  console.log('API Key:', process.env.OPENWEATHER_API_KEY);

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

    await SearchHistory.create({ city });
    res.json(response.data);

  } catch (err) {
    console.log('Full error:', err.response?.data);
    console.log('Status:', err.response?.status);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;