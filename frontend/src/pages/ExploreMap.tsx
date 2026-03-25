import { useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@/styles/map.css";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Image, Video, BookOpen, Trash2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Custom amber marker icon
const createWaymarkIcon = (isActive = false) =>
  L.divIcon({
    className: "waymark-icon",
    html: `<div style="
      width: 32px; height: 32px;
      background: ${isActive ? "hsl(35, 90%, 60%)" : "hsl(35, 70%, 55%)"};
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid hsl(220, 20%, 6%);
      box-shadow: 0 0 ${isActive ? "20px" : "10px"} hsl(35 70% 55% / ${isActive ? "0.6" : "0.3"});
      display: flex; align-items: center; justify-content: center;
    ">
      <div style="
        width: 10px; height: 10px;
        background: hsl(220, 20%, 6%);
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

interface WayMark {
  id: string;
  lat: number;
  lng: number;
  title: string;
  story: string;
  mediaType: "photo" | "video" | "none";
  createdAt: Date;
}

// Component to handle map clicks
const MapClickHandler = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const ExploreMap = () => {
  const navigate = useNavigate();
  const [waymarks, setWaymarks] = useState<WayMark[]>([
    {
      id: "demo-1",
      lat: 62.1,
      lng: -6.83,
      title: "Faroe Islands Switchback",
      story: "The fog lifted just as we crested the ridge. Below, the road twisted through green valleys into the sea. One of those drives you never forget.",
      mediaType: "video",
      createdAt: new Date("2025-08-14"),
    },
    {
      id: "demo-2",
      lat: 62.47,
      lng: 7.09,
      title: "Trollstigen at Dawn",
      story: "We started the climb before sunrise. By the time we reached the top, the whole valley was bathed in golden light.",
      mediaType: "photo",
      createdAt: new Date("2025-07-22"),
    },
  ]);
  const [selectedWaymark, setSelectedWaymark] = useState<WayMark | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newPin, setNewPin] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState({ title: "", story: "", mediaType: "none" as WayMark["mediaType"] });

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      if (!isCreating) return;
      setNewPin({ lat, lng });
    },
    [isCreating]
  );

  const handleSaveWaymark = () => {
    if (!newPin || !formData.title.trim()) return;
    const wm: WayMark = {
      id: crypto.randomUUID(),
      lat: newPin.lat,
      lng: newPin.lng,
      title: formData.title,
      story: formData.story,
      mediaType: formData.mediaType,
      createdAt: new Date(),
    };
    setWaymarks((prev) => [...prev, wm]);
    setNewPin(null);
    setIsCreating(false);
    setFormData({ title: "", story: "", mediaType: "none" });
    setSelectedWaymark(wm);
  };

  const handleDeleteWaymark = (id: string) => {
    setWaymarks((prev) => prev.filter((w) => w.id !== id));
    if (selectedWaymark?.id === id) setSelectedWaymark(null);
  };

  const cancelCreating = () => {
    setIsCreating(false);
    setNewPin(null);
    setFormData({ title: "", story: "", mediaType: "none" });
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* Top bar */}
      <div className="h-14 glass-panel border-b border-border flex items-center justify-between px-4 z-[1000] relative">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-semibold text-foreground">
              Way<span className="text-primary">Mark</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-body hidden sm:block">
            {waymarks.length} WayMarks
          </span>
          {isCreating ? (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={cancelCreating}>
                Cancel
              </Button>
              <span className="text-sm text-primary font-body animate-pulse">
                Click the map to drop a pin
              </span>
            </div>
          ) : (
            <Button variant="hero" size="sm" onClick={() => setIsCreating(true)}>
              <MapPin className="mr-1 h-4 w-4" />
              Drop WayMark
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 flex relative">
        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={[62.3, 0]}
            zoom={5}
            className="h-full w-full"
            style={{ background: "hsl(220, 20%, 6%)" }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <MapClickHandler onMapClick={handleMapClick} />

            {waymarks.map((wm) => (
              <Marker
                key={wm.id}
                position={[wm.lat, wm.lng]}
                icon={createWaymarkIcon(selectedWaymark?.id === wm.id)}
                eventHandlers={{
                  click: () => setSelectedWaymark(wm),
                }}
              >
                <Popup className="waymark-popup">
                  <div className="font-body text-sm">
                    <strong>{wm.title}</strong>
                  </div>
                </Popup>
              </Marker>
            ))}

            {newPin && (
              <Marker position={[newPin.lat, newPin.lng]} icon={createWaymarkIcon(true)} />
            )}
          </MapContainer>

          {/* Cursor hint overlay when creating */}
          {isCreating && !newPin && (
            <div className="absolute inset-0 pointer-events-none z-[500] flex items-center justify-center">
              <div className="glass-panel rounded-xl px-6 py-3 text-primary font-body text-sm">
                Click anywhere on the map to place your WayMark
              </div>
            </div>
          )}
        </div>

        {/* Side panel */}
        <AnimatePresence>
          {(selectedWaymark || newPin) && (
            <motion.div
              initial={{ x: 360, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 360, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-[360px] glass-panel border-l border-border overflow-y-auto z-[1000] hidden md:block"
            >
              {newPin ? (
                /* Create form */
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      New WayMark
                    </h3>
                    <Button variant="ghost" size="icon" onClick={cancelCreating}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground font-body mb-6">
                    📍 {newPin.lat.toFixed(4)}, {newPin.lng.toFixed(4)}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground font-body block mb-1.5">
                        Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Name this road..."
                        maxLength={100}
                        className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground font-body block mb-1.5">
                        Your Story
                      </label>
                      <textarea
                        value={formData.story}
                        onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                        placeholder="What made this road unforgettable?"
                        maxLength={1000}
                        rows={5}
                        className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground font-body block mb-2">
                        Media Type
                      </label>
                      <div className="flex gap-2">
                        {[
                          { value: "photo" as const, icon: Image, label: "Photo" },
                          { value: "video" as const, icon: Video, label: "Video" },
                          { value: "none" as const, icon: BookOpen, label: "Story Only" },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setFormData({ ...formData, mediaType: opt.value })}
                            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-lg border text-xs font-body transition-all ${
                              formData.mediaType === opt.value
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border text-muted-foreground hover:border-primary/30"
                            }`}
                          >
                            <opt.icon className="h-4 w-4" />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="hero"
                      className="w-full mt-2"
                      disabled={!formData.title.trim()}
                      onClick={handleSaveWaymark}
                    >
                      Save WayMark
                    </Button>
                  </div>
                </div>
              ) : selectedWaymark ? (
                /* Detail view */
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {selectedWaymark.title}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedWaymark(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 mb-6 text-xs text-muted-foreground font-body">
                    <span>📍 {selectedWaymark.lat.toFixed(4)}, {selectedWaymark.lng.toFixed(4)}</span>
                    <span className="text-border">•</span>
                    <span>{selectedWaymark.createdAt.toLocaleDateString()}</span>
                  </div>

                  {selectedWaymark.mediaType !== "none" && (
                    <div className="glass-panel rounded-xl h-48 flex items-center justify-center mb-6 border border-border">
                      <div className="text-center text-muted-foreground">
                        {selectedWaymark.mediaType === "video" ? (
                          <Video className="h-8 w-8 mx-auto mb-2 text-primary/50" />
                        ) : (
                          <Image className="h-8 w-8 mx-auto mb-2 text-primary/50" />
                        )}
                        <span className="text-xs font-body">
                          {selectedWaymark.mediaType === "video" ? "POV Clip" : "Photo"} placeholder
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h4 className="text-xs text-muted-foreground font-body mb-2 uppercase tracking-wider">
                      The Story
                    </h4>
                    <p className="text-sm text-foreground/80 font-body leading-relaxed">
                      {selectedWaymark.story || "No story written yet."}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    onClick={() => handleDeleteWaymark(selectedWaymark.id)}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete WayMark
                  </Button>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile bottom sheet */}
        <AnimatePresence>
          {(selectedWaymark || newPin) && (
            <motion.div
              initial={{ y: 300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 glass-panel border-t border-border p-4 z-[1000] md:hidden max-h-[60vh] overflow-y-auto rounded-t-2xl"
            >
              {newPin ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-base font-semibold text-foreground">New WayMark</h3>
                    <Button variant="ghost" size="icon" onClick={cancelCreating}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Name this road..."
                    maxLength={100}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <textarea
                    value={formData.story}
                    onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                    placeholder="Your story..."
                    maxLength={1000}
                    rows={3}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                  <Button variant="hero" className="w-full" disabled={!formData.title.trim()} onClick={handleSaveWaymark}>
                    Save WayMark
                  </Button>
                </div>
              ) : selectedWaymark ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-base font-semibold text-foreground">{selectedWaymark.title}</h3>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedWaymark(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-foreground/80 font-body leading-relaxed">
                    {selectedWaymark.story || "No story yet."}
                  </p>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExploreMap;
