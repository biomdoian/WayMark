import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordChecks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains uppercase", met: /[A-Z]/.test(password) },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Connect to your backend API
    console.log("Signup attempt:", { fullName, email, password });
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side — branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/3 w-56 h-56 rounded-full bg-primary/15 blur-[80px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-12 max-w-lg"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <MapPin className="h-10 w-10 text-primary" />
            <span className="font-display text-4xl font-semibold text-foreground tracking-tight">
              Way<span className="text-primary">Mark</span>
            </span>
          </div>
          <h2 className="font-display text-2xl text-foreground/90 mb-4">
            Start Your Journey
          </h2>
          <p className="font-body text-muted-foreground text-lg leading-relaxed">
            Join thousands of explorers documenting their adventures across the globe.
          </p>

          <div className="mt-10 space-y-4 text-left">
            {["Pin your favorite places on the map", "Share travel chronicles", "Connect with fellow explorers"].map((feature) => (
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

      {/* Right side — signup form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <MapPin className="h-7 w-7 text-primary" />
            <span className="font-display text-2xl font-semibold text-foreground tracking-tight">
              Way<span className="text-primary">Mark</span>
            </span>
          </div>

          <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
            Create your account
          </h1>
          <p className="font-body text-muted-foreground mb-8">
            Start marking your journey today
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-foreground/80">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Jane Explorer"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-12 bg-secondary border-border focus:border-primary/50 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="explorer@waymark.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-secondary border-border focus:border-primary/50 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-secondary border-border focus:border-primary/50 text-foreground placeholder:text-muted-foreground pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Password strength indicators */}
              {password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-1.5 pt-1"
                >
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full transition-colors ${check.met ? "bg-green-500" : "bg-muted-foreground/40"}`} />
                      <span className={`text-xs font-body transition-colors ${check.met ? "text-green-500" : "text-muted-foreground/60"}`}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            <Button
              type="submit"
              variant="hero"
              className="w-full h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-body uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="mt-6 space-y-3">
            <Button
              variant="outline"
              className="w-full h-12 border-border bg-secondary hover:bg-secondary/80 text-foreground"
              type="button"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground font-body">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-muted-foreground/60 font-body">
            By creating an account, you agree to our{" "}
            <a href="#" className="underline hover:text-muted-foreground">Terms</a> and{" "}
            <a href="#" className="underline hover:text-muted-foreground">Privacy Policy</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
