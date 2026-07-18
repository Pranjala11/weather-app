import { useEffect, useState } from 'react'
import axios from 'axios'
const API = import.meta.env.VITE_API_URL || 'https://parabola-marshland-crown.ngrok-free.dev'

function SearchHistory({ onCityClick }) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API}/api/history`)
        setHistory(res.data)
      } catch (err) {
        console.log('History error:', err)
      }
    }
    fetchHistory()
  }, [])

  if (history.length === 0) return null

  return (
    <div className="history">
      <h3>Recent Searches</h3>
      <div className="history-list">
        {history.map((item) => (
          <button
            key={item._id}
            className="history-item"
            onClick={() => onCityClick(item.city)}
          >
            🕐 {item.city.charAt(0).toUpperCase() + item.city.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SearchHistory