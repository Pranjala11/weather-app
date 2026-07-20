import { useState } from 'react'
import axios from 'axios'
import './App.css'

const API_KEY = 'your_openweather_key_here'
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

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
  const [bgClass, setBgClass] = useState('bg-default')
  const [history, setHistory] = useState([])

  const searchWeather = async (cityName) => {
    const searchCity = cityName || city
    if (!searchCity) return
    setLoading(true)
    setError('')
    setWeather(null)

    try {
      const res = await axios.get(BASE_URL, {
        params: {
          q: searchCity,
          appid: API_KEY,
          units: 'metric'
        }
      })
      setWeather(res.data)
      setBgClass(getBgClass(res.data.weather[0].main))
      setHistory(prev => {
        const filtered = prev.filter(c => c.toLowerCase() !== searchCity.toLowerCase())
        return [searchCity, ...filtered].slice(0, 8)
      })
    } catch (err) {
      setError('City not found')
    } finally {
      setLoading(false)
    }
  }

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      return
    }
    setLoading(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const res = await axios.get(BASE_URL, {
            params: {
              lat: latitude,
              lon: longitude,
              appid: API_KEY,
              units: 'metric'
            }
          })
          setWeather(res.data)
          setBgClass(getBgClass(res.data.weather[0].main))
        } catch (err) {
          setError('Could not get location weather')
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
          <h1>WEATHER</h1>
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
          <button className="gps-btn" onClick={getLocation}>
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

        {history.length > 0 && (
          <div className="history">
            <h3>Recent Searches</h3>
            <div className="history-list">
              {history.map((item, index) => (
                <button
                  key={index}
                  className="history-item"
                  onClick={() => {
                    setCity(item)
                    searchWeather(item)
                  }}
                >
                  🕐 {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App