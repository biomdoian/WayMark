import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css' 
import WayMarkMap from './components/WayMarkMap'

function App() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [formData, setFormData] = useState({ label: '', story: '', timestamp: '' })

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = () => {
    axios.get('http://127.0.0.1:5555/trips')
      .then(response => {
        setTrips(response.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const handleMapClick = (latlng) => setSelectedLocation(latlng)

  const handleSaveWayMark = async (e) => {
    e.preventDefault()
    const newWayMark = {
      label: formData.label,
      story: formData.story,
      timestamp_in_video: parseInt(formData.timestamp) || 0,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
      trip_id: trips[0]?.id 
    }

    try {
      await axios.post('http://127.0.0.1:5555/waypoints', newWayMark)
      fetchTrips() // Refresh UI
      setSelectedLocation(null)
      setFormData({ label: '', story: '', timestamp: '' })
    } catch (err) {
      alert("Error saving pin.")
    }
  }

  // NEW: Logical handler for the delete action
  const handleDeleteWayMark = async (id) => {
    if (window.confirm("Are you sure you want to remove this memory from the map?")) {
      try {
        await axios.delete(`http://127.0.0.1:5555/waypoints/${id}`)
        fetchTrips() // Refresh the map and list immediately
      } catch (err) {
        alert("Could not delete the waypoint.")
      }
    }
  }

  return (
    <div className="min-h-screen bg-waymark-black text-white selection:bg-waymark-amber font-sans">
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-6 bg-waymark-black/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-waymark-amber text-2xl">📍</span>
          <span className="font-bold text-xl tracking-tight uppercase">WayMark</span>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-8 md:px-24">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="h-[500px] bg-waymark-gray/20 rounded-3xl overflow-hidden border border-white/5 relative">
              <WayMarkMap 
                waymarks={trips[0]?.waymarks || []} 
                onMapClick={handleMapClick}
                selectedLocation={selectedLocation}
              />
              {selectedLocation && (
                <div className="absolute top-4 right-4 z-[1000] w-72 bg-waymark-black/90 backdrop-blur-xl p-6 rounded-2xl border border-waymark-amber/30 shadow-2xl">
                  <h3 className="text-waymark-amber font-bold mb-4">New Waypoint 📍</h3>
                  <form onSubmit={handleSaveWayMark} className="space-y-4">
                    <input className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm" placeholder="Location Name" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} required />
                    <textarea className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm h-20" placeholder="The story..." value={formData.story} onChange={e => setFormData({...formData, story: e.target.value})} />
                    <input className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm" placeholder="Timestamp (s)" type="number" value={formData.timestamp} onChange={e => setFormData({...formData, timestamp: e.target.value})} />
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-waymark-amber text-black font-bold py-2 rounded-lg text-xs">Save Pin</button>
                      <button type="button" onClick={() => setSelectedLocation(null)} className="flex-1 bg-white/5 py-2 rounded-lg text-xs">Cancel</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {loading ? <p>Loading...</p> : trips.map(trip => (
              <div key={trip.id} className="p-8 bg-waymark-gray/20 border border-white/5 rounded-3xl">
                <h3 className="text-2xl font-bold mb-2">{trip.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{trip.description}</p>
                <div className="flex flex-col gap-3">
                  {trip.waymarks?.map(wm => (
                    <div key={wm.id} className="flex items-center justify-between bg-waymark-amber/10 border border-waymark-amber/20 px-3 py-2 rounded-xl group">
                      <span className="text-[11px] text-waymark-amber font-medium uppercase tracking-wider">{wm.label}</span>
                      <button 
                        onClick={() => handleDeleteWayMark(wm.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors text-lg leading-none"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App