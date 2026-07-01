import { useState } from 'react'
import axios from 'axios'
import SearchHistory from './SearchHistory'
import './App.css'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [refreshHistory, setRefreshHistory] = useState(0)

  const searchWeather = async (cityName) => {
    const searchCity = cityName || city
    if (!searchCity) return
    setLoading(true)
    setError('')
    setWeather(null)

    try {
      const res = await axios.get(`http://localhost:5000/api/weather?city=${searchCity}`)
      setWeather(res.data)
      setRefreshHistory(prev => prev + 1)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') searchWeather()
  }

  return (
    <div className="container">
      <h1>🌤️ Weather App</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={() => searchWeather()} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {weather && (
        <div className="weather-card">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <div className="temp">{Math.round(weather.main.temp)}°C</div>
          <div className="description">
            {weather.weather[0].description}
          </div>
          <div className="details">
            <div className="detail">
              <span>💧 Humidity</span>
              <span>{weather.main.humidity}%</span>
            </div>
            <div className="detail">
              <span>🌬️ Wind</span>
              <span>{weather.wind.speed} m/s</span>
            </div>
            <div className="detail">
              <span>🌡️ Feels like</span>
              <span>{Math.round(weather.main.feels_like)}°C</span>
            </div>
          </div>
        </div>
      )}

      <SearchHistory
        key={refreshHistory}
        onCityClick={(cityName) => {
          setCity(cityName)
          searchWeather(cityName)
        }}
      />
    </div>
  )
}

export default App