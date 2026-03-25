# WayMark
Phase 1: Architecture & Data (The Foundation)

Database Design: Created a relational schema in models.py linking Users, Trips, and WayMarks (pins).

Cascade Logic: Implemented "delete-orphan" rules so that cleaning up a trip automatically cleans up its map markers, keeping your database lean.

Phase 2: The Interactive Map (The "Storyteller")

Leaflet Integration: Successfully rendered a high-performance map of Kenya.

Dynamic Pinning: Built the handleMapClick logic, allowing you to visually "mark" spots like the Nairobi Expressway or Kenyatta Avenue Junction directly on the interface.

Real-time State: Set up React hooks to manage "New Waypoint" forms that pop up exactly where you click.

Phase 3: Full CRUD Integration (The "Engine")
Persistent Storage: Connected the frontend to Flask via axios.post. Your road stories are no longer temporary; they stay saved in the database even after a refresh.

Interactive List: Developed a sidebar that syncs with the map, showing your "Active Journeys" and allowing you to delete unwanted pins with a single click.

DevOps & Version Control: Successfully organized the project structure into frontend and backend, managed dependencies, and pushed the entire verified build to GitHub.

