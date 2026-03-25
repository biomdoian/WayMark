import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, User, Settings, LogOut, Compass, Edit2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface DashboardProps {
  user: any;
  setUser: (user: any) => void;
}

const Dashboard = ({ user, setUser }: DashboardProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"waymarks" | "settings">("waymarks");
  const [editingProfile, setEditingProfile] = useState(false);
  
  const [profile, setProfile] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "Adventurer and WayMark storyteller.",
    joinedDate: "2026",
    totalDistance: "0 km"
  });

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username,
        email: user.email,
        bio: user.bio || "Adventurer and WayMark storyteller.",
        joinedDate: "2026",
        totalDistance: "0 km"
      });
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("waymark_user");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleSaveChanges = async () => {
    if (!user?.id) {
      toast.error("Session expired. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5555/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: profile.username,
          email: profile.email,
          bio: profile.bio
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        localStorage.setItem("waymark_user", JSON.stringify(updatedUser));
        setEditingProfile(false);
        toast.success("Profile updated!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Update failed.");
      }
    } catch (error) {
      toast.error("Connection error to backend.");
    }
  };
  const stats = [
    { label: "WayMarks", value: "0" }, 
    { label: "Distance", value: profile.totalDistance },
    { label: "Since", value: profile.joinedDate },
  ];

  return (
    <div className="min-h-screen bg-background text-white font-body">
      {/* Top nav */}
      <div className="h-14 glass-panel border-b border-border flex items-center justify-between px-6 sticky top-0 z-50 bg-black/40 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2 group">
          <MapPin className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
          <span className="font-display text-lg font-semibold tracking-tight">
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
            onClick={handleLogout}
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
          className="glass-panel rounded-2xl p-6 md:p-8 mb-8 border border-border bg-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="h-24 w-24 rounded-full bg-secondary border-2 border-primary/30 flex items-center justify-center overflow-hidden shadow-xl">
                <User className="h-10 w-10 text-muted-foreground" />
            </div>

            <div className="flex-1">
              <h1 className="font-display text-3xl font-bold">{profile.username}</h1>
              <p className="text-sm text-gray-400 font-body mt-2 max-w-md italic">
                {profile.bio}
              </p>
            </div>

            <div className="flex gap-10 border-l border-white/5 pl-10 hidden md:flex">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-2xl font-bold">{stat.value}</div>
                  <div className="text-[10px] text-muted-foreground font-body uppercase tracking-widest mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <div className="flex gap-8 border-b border-white/5 mb-8">
          {[
            { key: "waymarks" as const, label: "My WayMarks", icon: MapPin },
            { key: "settings" as const, label: "Settings", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 pb-4 text-sm font-medium transition-all relative ${
                activeTab === tab.key ? "text-primary" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {activeTab === tab.key && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === "waymarks" ? (
            <motion.div 
              key="waymarks" 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 10 }}
              className="text-center py-20"
            >
              <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-2">Welcome back, {profile.username}</h3>
              <p className="text-muted-foreground font-body mb-8">You haven't dropped any WayMarks on the map yet.</p>
              <Button variant="hero" size="lg" className="rounded-full px-8" asChild>
                <Link to="/explore">Start Exploring</Link>
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              key="settings" 
              initial={{ opacity: 0, x: 10 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: -10 }}
              className="max-w-2xl"
            >
              <div className="glass-panel rounded-2xl border border-white/5 p-8 bg-white/5">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-display text-xl font-bold">Profile Settings</h3>
                  <Button variant="ghost" size="sm" onClick={() => setEditingProfile(!editingProfile)} className="text-primary hover:bg-primary/10">
                    {editingProfile ? "Cancel" : <><Edit2 className="h-4 w-4 mr-2" /> Edit Profile</>}
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-gray-400">Username</Label>
                    <Input
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                      disabled={!editingProfile}
                      className="bg-white/5 border-white/10 h-12 focus:border-primary/50 disabled:opacity-50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-gray-400">Email Address</Label>
                    <Input
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      disabled={!editingProfile}
                      className="bg-white/5 border-white/10 h-12 focus:border-primary/50 disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-400">Profile Bio</Label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      disabled={!editingProfile}
                      placeholder="Tell the world about your POV journeys..."
                      className="w-full bg-white/5 border border-white/10 rounded-md p-3 min-h-[120px] focus:outline-none focus:border-primary/50 disabled:opacity-50 text-sm font-body leading-relaxed transition-colors"
                    />
                  </div>

                  {editingProfile && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Button variant="hero" className="w-full h-12 font-bold shadow-lg shadow-primary/20" onClick={handleSaveChanges}>
                        Save All Changes
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;