import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, User, Settings, LogOut, Image, Video, BookOpen, Calendar, Compass, ChevronRight, Edit2, Camera } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SavedWayMark {
  id: string;
  title: string;
  story: string;
  lat: number;
  lng: number;
  mediaType: "photo" | "video" | "none";
  createdAt: string;
}

// Mock data — replace with API calls to your backend
const mockUser = {
  name: "Alex Explorer",
  email: "alex@waymark.com",
  avatarUrl: "",
  bio: "Documenting roads less traveled. Based in Scandinavia.",
  joinedDate: "March 2025",
  totalDistance: "12,480 km",
};

const mockWaymarks: SavedWayMark[] = [
  { id: "1", title: "Faroe Islands Switchback", story: "The fog lifted just as we crested the ridge. Below, the road twisted through green valleys into the sea.", lat: 62.1, lng: -6.83, mediaType: "video", createdAt: "Aug 14, 2025" },
  { id: "2", title: "Trollstigen at Dawn", story: "We started the climb before sunrise. Golden light bathed the entire valley.", lat: 62.47, lng: 7.09, mediaType: "photo", createdAt: "Jul 22, 2025" },
  { id: "3", title: "Atlantic Road Crossing", story: "Waves crashed over the road as we drove across. Pure adrenaline.", lat: 63.01, lng: 7.36, mediaType: "photo", createdAt: "Jul 18, 2025" },
  { id: "4", title: "Lofoten Night Drive", story: "Midnight sun painting everything in warm amber. The road felt infinite.", lat: 68.15, lng: 14.56, mediaType: "none", createdAt: "Jun 30, 2025" },
];

const mediaIcons = {
  photo: Image,
  video: Video,
  none: BookOpen,
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"waymarks" | "settings">("waymarks");
  const [editingProfile, setEditingProfile] = useState(false);
  const [profile, setProfile] = useState(mockUser);

  const stats = [
    { label: "WayMarks", value: mockWaymarks.length.toString() },
    { label: "Distance", value: mockUser.totalDistance },
    { label: "Since", value: mockUser.joinedDate },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <div className="h-14 glass-panel border-b border-border flex items-center justify-between px-6 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 group">
          <MapPin className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
          <span className="font-display text-lg font-semibold text-foreground tracking-tight">
            Way<span className="text-primary">Mark</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
            <Link to="/explore">
              <Compass className="h-4 w-4 mr-1" />
              Explore
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => {
              // TODO: Call your backend logout API
              navigate("/login");
            }}
          >
            <LogOut className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-2xl p-6 md:p-8 mb-8 border border-border"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="h-20 w-20 rounded-full bg-secondary border-2 border-primary/30 flex items-center justify-center overflow-hidden">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="font-display text-2xl font-semibold text-foreground">{profile.name}</h1>
              <p className="text-sm text-muted-foreground font-body mt-1">{profile.bio}</p>
            </div>

            {/* Stats */}
            <div className="flex gap-6 sm:gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-xl font-semibold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground font-body uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {[
            { key: "waymarks" as const, label: "My WayMarks", icon: MapPin },
            { key: "settings" as const, label: "Settings", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-body transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "waymarks" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {mockWaymarks.length === 0 ? (
              <div className="text-center py-20">
                <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-display text-xl text-foreground mb-2">No WayMarks yet</h3>
                <p className="text-muted-foreground font-body mb-6">Start exploring and drop your first WayMark on the map</p>
                <Button variant="hero" asChild>
                  <Link to="/explore">Start Exploring</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {mockWaymarks.map((wm, index) => {
                  const MediaIcon = mediaIcons[wm.mediaType];
                  return (
                    <motion.div
                      key={wm.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="glass-panel rounded-xl border border-border p-5 hover:border-primary/30 transition-all group cursor-pointer"
                      onClick={() => navigate("/explore")}
                    >
                      <div className="flex items-start gap-4">
                        {/* Media type indicator */}
                        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <MediaIcon className="h-5 w-5 text-primary" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-display text-base font-semibold text-foreground truncate pr-4">
                              {wm.title}
                            </h3>
                            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          </div>
                          <p className="text-sm text-muted-foreground font-body line-clamp-2 mb-2">
                            {wm.story}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground/70 font-body">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {wm.lat.toFixed(2)}, {wm.lng.toFixed(2)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {wm.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-lg"
          >
            <div className="glass-panel rounded-xl border border-border p-6 space-y-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-lg font-semibold text-foreground">Profile Settings</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="text-primary"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  {editingProfile ? "Cancel" : "Edit"}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground/80">Full Name</Label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!editingProfile}
                    className="h-11 bg-secondary border-border text-foreground disabled:opacity-70"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground/80">Email</Label>
                  <Input
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!editingProfile}
                    className="h-11 bg-secondary border-border text-foreground disabled:opacity-70"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground/80">Bio</Label>
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    disabled={!editingProfile}
                    className="bg-secondary border-border text-foreground disabled:opacity-70 resize-none"
                    rows={3}
                  />
                </div>

                {editingProfile && (
                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={() => {
                      // TODO: Call your backend API to update profile
                      setEditingProfile(false);
                    }}
                  >
                    Save Changes
                  </Button>
                )}
              </div>
            </div>

            <div className="glass-panel rounded-xl border border-border p-6 mt-6">
              <h3 className="font-display text-lg font-semibold text-destructive mb-2">Danger Zone</h3>
              <p className="text-sm text-muted-foreground font-body mb-4">
                Permanently delete your account and all your WayMarks.
              </p>
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
