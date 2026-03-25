import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  
  // Initialize profile with user prop data
  const [profile, setProfile] = useState({
    username: user?.username || "Explorer",
    email: user?.email || "",
    bio: "Adventurer and WayMark storyteller.",
    joinedDate: "2026",
    totalDistance: "0 km"
  });

  // Keep state in sync if user logs in/out or refreshes
  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        username: user.username,
        email: user.email
      }));
    }
  }, [user]);

  const handleLogout = () => {
    // 1. Clear Local Storage
    localStorage.removeItem("waymark_user");
    // 2. Clear App State
    setUser(null);
    // 3. Feedback and Redirect
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const stats = [
    { label: "WayMarks", value: "0" }, 
    { label: "Distance", value: profile.totalDistance },
    { label: "Since", value: profile.joinedDate },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top nav */}
      <div className="h-14 glass-panel border-b border-border flex items-center justify-between px-6 sticky top-0 z-50">
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
          className="glass-panel rounded-2xl p-6 md:p-8 mb-8 border border-border"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-secondary border-2 border-primary/30 flex items-center justify-center overflow-hidden">
                <User className="h-8 w-8 text-muted-foreground" />
            </div>

            <div className="flex-1">
              <h1 className="font-display text-2xl font-semibold">{profile.username}</h1>
              <p className="text-sm text-muted-foreground font-body mt-1">{profile.bio}</p>
            </div>

            <div className="flex gap-6 sm:gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-xl font-semibold">{stat.value}</div>
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
                activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "waymarks" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-20">
              <MapPin className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="font-display text-xl mb-2">Welcome to your dashboard, {profile.username}</h3>
              <p className="text-muted-foreground font-body mb-6">You haven't dropped any WayMarks on the map yet.</p>
              <Button variant="hero" asChild>
                <Link to="/explore">Start Exploring</Link>
              </Button>
            </div>
          </motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg">
            <div className="glass-panel rounded-xl border border-border p-6 space-y-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-lg font-semibold">Profile Settings</h3>
                <Button variant="ghost" size="sm" onClick={() => setEditingProfile(!editingProfile)} className="text-primary">
                  <Edit2 className="h-4 w-4 mr-1" />
                  {editingProfile ? "Cancel" : "Edit"}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground/80">Username</Label>
                  <Input
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    disabled={!editingProfile}
                    className="h-11 bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground/80">Email</Label>
                  <Input
                    value={profile.email}
                    disabled={true} 
                    className="h-11 bg-secondary border-border opacity-70"
                  />
                </div>
                {editingProfile && (
                  <Button variant="hero" className="w-full" onClick={() => setEditingProfile(false)}>
                    Save Changes
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;