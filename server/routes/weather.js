router.get('/coords', async (req, res) => {
  const { lat, lon } = req.query

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
    )
    await SearchHistory.findOneAndUpdate(
      { city: response.data.name.toLowerCase() },
      { city: response.data.name.toLowerCase(), searchedAt: Date.now() },
      { upsert: true, new: true }
    )
    res.json(response.data)
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch weather by location' })
  }
})