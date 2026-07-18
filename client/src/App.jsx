import { useState } from 'react'
import axios from 'axios'
import SearchHistory from './SearchHistory'
import './App.css'

const API = 'https://parabola-marshland-crown.ngrok-free.dev'

const getWeatherIcon = (condition) => {
  const c = condition?.toLowerCase()
  if (c?.includes('thunder')) return '⛈️'
  if (c?.includes('drizzle')) return '🌦️'
  if (c?.includes('rain')) return '🌧️'
  if (c?.includes('snow')) return '❄️'
  if (c?.includes('mist') || c?.includes('fog')) return '🌫️'
  if (c?.includes('clear')) return '☀️'
  if (c?.includes('cloud')) return '⛅'
  return '🌤️'
}

const getBgClass = (condition) => {
  const c = condition?.toLowerCase()
  if (c?.includes('thunder')) return 'bg-thunderstorm'
  if (c?.includes('rain') || c?.includes('drizzle')) return 'bg-rain'
  if (c?.includes('snow')) return 'bg-snow'
  if (c?.includes('mist') || c?.includes('fog')) return 'bg-mist'
  if (c?.includes('clear')) return 'bg-clear'
  if (c?.includes('cloud')) return 'bg-clouds'
  return 'bg-default'
}

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [refreshHistory, setRefreshHistory] = useState(0)
  const [bgClass, setBgClass] = useState('bg-default')

  const searchWeather = async (cityName) => {
    const searchCity = cityName || city
    if (!searchCity) return
    setLoading(true)
    setError('')
    setWeather(null)

    try {
      const res = await axios.get(`${API}/api/weather?city=${searchCity}`)
      setWeather(res.data)
      setBgClass(getBgClass(res.data.weather[0].main))
      setRefreshHistory(prev => prev + 1)
    } catch (err) {
      setError(err.response?.data?.error || 'City not found')
    } finally {
      setLoading(false)
    }
  }

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser')
      return
    }
    setLoading(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const res = await axios.get(`${API}/api/weather/coords?lat=${latitude}&lon=${longitude}`)
          setWeather(res.data)
          setBgClass(getBgClass(res.data.weather[0].main))
          setRefreshHistory(prev => prev + 1)
        } catch (err) {
          setError('Could not get weather for your location')
        } finally {
          setLoading(false)
        }
      },
      () => {
        setError('Location access denied')
        setLoading(false)
      }
    )
  }

  return (
    <div className={`app ${bgClass}`}>
      <div className="container">
        <div className="header">
          <h1>WEATHER FORECAST</h1>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchWeather()}
          />
          <button onClick={() => searchWeather()}>
            {loading ? '...' : '🔍'}
          </button>
          <button className="gps-btn" onClick={getLocation} title="Use my location">
            📍
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {loading && <div className="loading">Fetching weather...</div>}

        {weather && !loading && (
          <div className="weather-card">
            <div className="city-name">{weather.name}</div>
            <div className="country">{weather.sys.country}</div>
            <div className="weather-icon">
              {getWeatherIcon(weather.weather[0].main)}
            </div>
            <div className="temp">
              {Math.round(weather.main.temp)}<sup>°C</sup>
            </div>
            <div className="description">{weather.weather[0].description}</div>

            <div className="divider" />

            <div className="details">
              <div className="detail">
                <span className="detail-icon">💧</span>
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weather.main.humidity}%</span>
              </div>
              <div className="detail">
                <span className="detail-icon">🌬️</span>
                <span className="detail-label">Wind</span>
                <span className="detail-value">{weather.wind.speed}m/s</span>
              </div>
              <div className="detail">
                <span className="detail-icon">🌡️</span>
                <span className="detail-label">Feels like</span>
                <span className="detail-value">{Math.round(weather.main.feels_like)}°C</span>
              </div>
            </div>

            <div className="extra-details">
              <div className="extra-item">
                <div className="label">Min Temp</div>
                <div className="value">{Math.round(weather.main.temp_min)}°C</div>
              </div>
              <div className="extra-item">
                <div className="label">Max Temp</div>
                <div className="value">{Math.round(weather.main.temp_max)}°C</div>
              </div>
              <div className="extra-item">
                <div className="label">Pressure</div>
                <div className="value">{weather.main.pressure} hPa</div>
              </div>
              <div className="extra-item">
                <div className="label">Visibility</div>
                <div className="value">{(weather.visibility / 1000).toFixed(1)} km</div>
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
    </div>
  )
}

export default App