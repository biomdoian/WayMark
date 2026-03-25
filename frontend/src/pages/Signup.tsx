import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface SignupProps {
  setUser: (user: any) => void;
}

const Signup = ({ setUser }: SignupProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const passwordChecks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains uppercase", met: /[A-Z]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordChecks.every(check => check.met)) {
      toast.error("Please meet all password requirements.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5555/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: fullName, 
          email: email,
          password: password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created! Now please sign in.");
        // We do NOT call setUser here because we want them to log in manually
        navigate("/login"); 
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch (error) {
      toast.error("Connection failed. Is the Flask server running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center" 
           style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/3 w-56 h-56 rounded-full bg-primary/15 blur-[80px]" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 text-center px-12 max-w-lg">
          <div className="flex items-center justify-center gap-3 mb-8">
            <MapPin className="h-10 w-10 text-primary" />
            <span className="font-display text-4xl font-semibold text-foreground tracking-tight">Way<span className="text-primary">Mark</span></span>
          </div>
          <h2 className="font-display text-2xl text-foreground/90 mb-4">Start Your Journey</h2>
          <p className="font-body text-muted-foreground text-lg leading-relaxed">Join thousands of explorers documenting their adventures across the globe.</p>
          <div className="mt-10 space-y-4 text-left">
            {["Pin your favorite places", "Share travel chronicles", "Connect with fellow explorers"].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-foreground/80 font-body text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="w-full max-w-md">
          <h1 className="font-display text-3xl font-semibold text-foreground mb-2">Create your account</h1>
          <p className="font-body text-muted-foreground mb-8">Start marking your journey today</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Jane Explorer" className="h-12 bg-secondary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="explorer@waymark.com" className="h-12 bg-secondary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="h-12 bg-secondary pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${check.met ? "bg-green-500" : "bg-muted-foreground/40"}`} />
                      <span className={`text-xs ${check.met ? "text-green-500" : "text-muted-foreground/60"}`}>{check.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button type="submit" variant="hero" className="w-full h-12" disabled={isLoading}>
              {isLoading ? <div className="h-5 w-5 border-2 border-t-transparent rounded-full animate-spin" /> : <>Create Account <ArrowRight className="h-4 w-4 ml-2" /></>}
            </Button>
          </form>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-medium">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;