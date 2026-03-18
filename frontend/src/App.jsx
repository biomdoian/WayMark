import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
// Import the new map component
import WayMarkMap from './components/WayMarkMap'

function App() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch trips from Flask API
  useEffect(() => {
    axios.get('http://127.0.0.1:5555/trips')
      .then(response => {
        setTrips(response.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching data: ", err)
        setError("Could not connect to the WayMark API. Make sure your Flask server is running on port 5555.")
        setLoading(false)
      })
  }, [])

  return (
    <div className="waymark-container">
      <header>
        <h1>WayMark</h1>
        <p className="tagline">Every Road Tells a Story</p>
      </header>

      <main>
        {loading && <p>Loading your journeys...</p>}
        {error && <p className="error">{error}</p>}
        
        <section className="trips-grid">
          {trips.map(trip => (
            <div key={trip.id} className="trip-card">
              <h2>{trip.title}</h2>
              <p>{trip.description}</p>
              
              {/* Render the Map here if waymarks exist */}
              {trip.waymarks && trip.waymarks.length > 0 ? (
                <WayMarkMap waymarks={trip.waymarks} />
              ) : (
                <p>No map data available for this trip.</p>
              )}
              
              <div className="waymarks-preview">
                <h3>WayMarks:</h3>
                {trip.waymarks && trip.waymarks.length > 0 ? (
                  <ul>
                    {trip.waymarks.map(wm => (
                      <li key={wm.id}>📍 {wm.label}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No waymarks dropped yet.</p>
                )}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}

export default App