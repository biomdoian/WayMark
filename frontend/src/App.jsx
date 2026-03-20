import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css' 
import WayMarkMap from './components/WayMarkMap'

function App() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
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
      .catch(err => {
        setError("Could not connect to the WayMark API.")
        setLoading(false)
      })
  }

  const handleMapClick = (latlng) => {
    setSelectedLocation(latlng)
  }

  // UPDATED: Now sends data to your Flask backend
  const handleSaveWayMark = async (e) => {
    e.preventDefault()
    
    const newWayMark = {
      label: formData.label,
      story: formData.story,
      timestamp_in_video: parseInt(formData.timestamp) || 0,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
      trip_id: trips[0]?.id // Connects to your first active trip
    }

    try {
      // Sending POST request to your Flask backend
      await axios.post('http://127.0.0.1:5555/waypoints', newWayMark)
      
      // Refresh data so the new pin stays on the map
      fetchTrips();
      
      // Reset state
      setSelectedLocation(null)
      setFormData({ label: '', story: '', timestamp: '' })
    } catch (err) {
      console.error("Error saving waymark:", err)
      alert("Failed to save waypoint. Is the Flask server running?")
    }
  }

  return (
    <div className="min-h-screen bg-waymark-black text-white selection:bg-waymark-amber font-sans">
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-6 bg-waymark-black/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-waymark-amber text-2xl">📍</span>
          <span className="font-bold text-xl tracking-tight uppercase">WayMark</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Home</a>
          <a href="#" className="hover:text-white transition-colors">Journeys</a>
        </div>
        <button className="bg-waymark-amber text-black text-sm font-bold px-6 py-2 rounded-lg hover:brightness-110 transition-all">
          Explore Map
        </button>
      </nav>

      <header className="relative h-[80vh] flex flex-col items-start justify-center px-8 md:px-24 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1518005020453-1cb343e0afe0?q=80')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-waymark-black via-waymark-black/80 to-transparent z-10"></div>
        <div className="relative z-20 max-w-4xl">
          <p className="text-waymark-amber font-black uppercase tracking-[0.3em] text-xs mb-4">📍 Kenya POV Archive</p>
          <h1 className="text-6xl md:text-8xl font-serif mb-6 leading-tight">Mark the roads <br /><span className="italic text-waymark-amber">that shaped you</span></h1>
        </div>
      </header>

      <main className="py-24 px-8 md:px-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-waymark-amber text-xs font-bold uppercase tracking-widest mb-4">Road Chronicles</p>
            <h2 className="text-5xl font-serif">Active Journeys</h2>
          </div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-[500px] bg-waymark-gray/20 rounded-3xl overflow-hidden border border-white/5 relative">
              <WayMarkMap 
                waymarks={trips[0]?.waymarks || []} 
                onMapClick={handleMapClick}
                selectedLocation={selectedLocation}
              />
              
              {selectedLocation && (
                <div className="absolute top-4 right-4 z-[1000] w-72 bg-waymark-black/90 backdrop-blur-xl p-6 rounded-2xl border border-waymark-amber/30 shadow-2xl">
                  <h3 className="text-waymark-amber font-bold mb-4 flex justify-between">New Waypoint <span>📍</span></h3>
                  <form onSubmit={handleSaveWayMark} className="space-y-4">
                    <input className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-waymark-amber text-white" placeholder="Location Name" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} required />
                    <textarea className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm h-20 focus:outline-none focus:border-waymark-amber text-white" placeholder="The story..." value={formData.story} onChange={e => setFormData({...formData, story: e.target.value})} />
                    <input className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-waymark-amber text-white" placeholder="Video Timestamp (s)" type="number" value={formData.timestamp} onChange={e => setFormData({...formData, timestamp: e.target.value})} />
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
            {loading ? <div className="animate-pulse h-32 bg-white/5 rounded-3xl"></div> : trips.map(trip => (
              <div key={trip.id} className="p-8 bg-waymark-gray/20 border border-white/5 rounded-3xl">
                <h3 className="text-2xl font-bold mb-2">{trip.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{trip.description}</p>
                <div className="flex flex-wrap gap-2">
                  {trip.waymarks?.map(wm => (
                    <span key={wm.id} className="text-[10px] bg-waymark-amber/10 text-waymark-amber border border-waymark-amber/20 px-2 py-1 rounded-full">{wm.label}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-12 text-center text-gray-600 border-t border-white/5">
        <p>© 2026 Ian Biomdo // POV Driving Project</p>
      </footer>
    </div>
  )
}

export default App