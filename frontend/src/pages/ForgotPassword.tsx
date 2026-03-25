import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Connect to your backend API
    console.log("Password reset for:", email);
    setTimeout(() => {
      setIsLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-2 mb-10">
          <MapPin className="h-7 w-7 text-primary" />
          <span className="font-display text-2xl font-semibold text-foreground tracking-tight">
            Way<span className="text-primary">Mark</span>
          </span>
        </div>

        {!sent ? (
          <>
            <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
              Reset your password
            </h1>
            <p className="font-body text-muted-foreground mb-8">
              Enter your email and we'll send you a reset link
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
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

              <Button
                type="submit"
                variant="hero"
                className="w-full h-12 text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-primary/15 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
              Check your email
            </h1>
            <p className="font-body text-muted-foreground mb-6">
              We've sent a password reset link to <span className="text-foreground">{email}</span>
            </p>
            <Button
              variant="outline"
              className="border-border bg-secondary hover:bg-secondary/80 text-foreground"
              onClick={() => setSent(false)}
            >
              Try a different email
            </Button>
          </motion.div>
        )}

        <div className="mt-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-body"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
