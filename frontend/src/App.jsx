import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css' 
import WayMarkMap from './components/WayMarkMap'

function App() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios.get('http://127.0.0.1:5555/trips')
      .then(response => {
        setTrips(response.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching data: ", err)
        setError("Could not connect to the WayMark API. Ensure Flask is running.")
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-waymark-black text-white selection:bg-waymark-amber font-sans">
      
      {/* NAVIGATION BAR */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-6 bg-waymark-black/50 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-waymark-amber text-2xl">📍</span>
          <span className="font-bold text-xl tracking-tight">WayMark</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Home</a>
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Journeys</a>
          <a href="#" className="hover:text-white transition-colors">About</a>
        </div>
        <button className="bg-waymark-amber text-black text-sm font-bold px-6 py-2 rounded-lg hover:brightness-110 transition-all">
          Explore Map
        </button>
      </nav>

      {/* HERO SECTION - Updated with Kenyan Scenery & Animated Road */}
      <header className="relative h-screen flex flex-col items-start justify-center px-8 md:px-24 overflow-hidden bg-waymark-black">
        {/* Background: Kenyan Escarpment/Road Scenery */}
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1627589139265-27a9889758e5?q=80')] bg-cover bg-center opacity-30"></div>
        
        {/* The Horizon Sun Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-waymark-amber/10 blur-[120px] rounded-full z-10"></div>

        {/* The Animated Road Perspective */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[40vh] z-10 overflow-hidden" 
             style={{ perspective: '500px' }}>
          <div className="absolute inset-0 road-animation"
               style={{ 
                 transform: 'rotateX(60deg)', 
                 transformOrigin: 'bottom',
                 background: 'linear-gradient(to bottom, transparent, rgba(245, 158, 11, 0.05)), repeating-linear-gradient(0deg, transparent, transparent 20px, #F59E0B 20px, #F59E0B 40px)' 
               }}>
          </div>
        </div>

        <div className="relative z-20 max-w-4xl">
          <p className="text-waymark-amber font-black uppercase tracking-[0.3em] text-sm mb-4 flex items-center gap-2">
            <span className="text-lg">📍</span> Every road tells a story
          </p>
          <h1 className="text-7xl md:text-9xl font-serif mb-6 leading-tight">
            Mark the roads <br />
            <span className="italic text-waymark-amber">that shaped you</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-xl mb-10 leading-relaxed">
            Documenting the Kenyan landscape, one mile at a time. From the Rift Valley switchbacks to the golden hour in Nakuru.
          </p>
          <div className="flex gap-6">
            <button className="bg-waymark-amber text-black font-bold px-10 py-4 rounded-lg flex items-center gap-3 hover:scale-105 transition-transform shadow-lg shadow-waymark-amber/20">
              <span>📍</span> Start Exploring
            </button>
            <button className="flex items-center gap-3 font-bold text-white hover:text-waymark-amber transition-colors group">
              <span className="border border-white/20 p-2 rounded-full group-hover:border-waymark-amber transition-colors">▶</span> See How It Works
            </button>
          </div>
        </div>
      </header>

      {/* HOW IT WORKS GRID */}
      <section className="py-24 px-8 md:px-24 bg-[#0a0a0a]">
        <p className="text-waymark-amber text-xs font-bold uppercase tracking-widest mb-4">How it works</p>
        <h2 className="text-5xl font-serif mb-12 max-w-2xl leading-tight">Every mile has a memory. WayMark helps you keep it.</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '📍', title: 'Drop WayMarks', desc: 'Pin any location on the interactive map.' },
            { icon: '📹', title: 'Attach POV Clips', desc: 'Upload point-of-view driving footage and photos.' },
            { icon: '📖', title: 'Write Your Narrative', desc: 'Journal the moments that mattered—the roadside chai.' },
            { icon: '🛡️', title: 'Your Road Chronicles', desc: 'Secure, personal accounts to manage your journeys.' }
          ].map((item, i) => (
            <div key={i} className="p-8 bg-waymark-gray/20 border border-white/5 rounded-2xl hover:border-waymark-amber/30 transition-colors group">
              <div className="text-3xl mb-6 bg-waymark-amber/10 w-12 h-12 flex items-center justify-center rounded-lg group-hover:bg-waymark-amber/20 transition-colors">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JOURNEYS SECTION */}
      <main className="py-24 px-8 md:px-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-waymark-amber text-xs font-bold uppercase tracking-widest mb-4">Road Chronicles</p>
            <h2 className="text-5xl font-serif">Stories from the road</h2>
          </div>
          <button className="text-gray-400 hover:text-waymark-amber transition-colors flex items-center gap-2">
            View all journeys <span>→</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-waymark-amber"></div></div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-xl text-red-400">{error}</div>
        ) : (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {trips.map(trip => (
              <div key={trip.id} className="bg-waymark-gray/20 border border-white/5 rounded-3xl overflow-hidden hover:border-waymark-amber/50 transition-all group">
                <div className="h-64 bg-black relative">
                  {trip.waymarks?.length > 0 ? <WayMarkMap waymarks={trip.waymarks} /> : <div className="h-full flex items-center justify-center text-gray-700 italic">No Map Data</div>}
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-waymark-amber flex items-center gap-2">
                    <span>📍</span> {trip.waymarks?.length || 0} WayMarks
                  </div>
                </div>
                <div className="p-8">
                  <p className="text-gray-500 text-xs uppercase tracking-tighter mb-2">Nairobi → Nakuru</p>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-waymark-amber transition-colors">{trip.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{trip.description}</p>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      {/* PROJECT TECH SECTION */}
      <section className="py-24 px-8 md:px-24 bg-waymark-gray/10 flex flex-col md:flex-row gap-16 items-center">
        <div className="w-full md:w-1/2 h-[400px] bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-waymark-amber text-6xl font-serif italic relative overflow-hidden">
          W
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80')] bg-cover opacity-20"></div>
        </div>
        <div className="w-full md:w-1/2">
          <p className="text-waymark-amber text-xs font-bold uppercase tracking-widest mb-4">The Project</p>
          <h2 className="text-5xl font-serif mb-8 leading-tight">Built for drivers who remember roads, not just destinations</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">WayMark was born from the idea that the journey matters more than the arrival. It's for those who take the longer route because the scenery is better.</p>
          <div className="flex flex-wrap gap-4">
            {['React', 'Flask', 'PostgreSQL', 'Tailwind CSS'].map(tech => (
              <span key={tech} className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-gray-300">
                 {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-24 text-center border-t border-white/5">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-waymark-amber text-2xl">📍</span>
          <span className="font-bold text-xl tracking-tight">WayMark</span>
        </div>
        <p className="text-gray-500 text-sm">© 2026 Ian Biomdo. Made with ❤️ in Nairobi</p>
      </footer>
    </div>
  )
}

export default App