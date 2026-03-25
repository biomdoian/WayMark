import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { motion } from "framer-motion"; // Added for the spinner
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import ExploreMap from "./pages/ExploreMap.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Chronicles from "./pages/Chronicles.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

// Clean, themed loading spinner
const LoadingSpinner = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full"
    />
  </div>
);

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on refresh
    const savedUser = localStorage.getItem("waymark_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing saved user", e);
      }
    }
    setIsLoading(false); // Done checking storage
  }, []);

  // Show the spinner while we verify the session
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index user={user} />} />
            <Route path="/explore" element={<ExploreMap />} />
            
            {/* Redirect logged-in users away from Auth pages */}
            <Route 
              path="/login" 
              element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/signup" 
              element={!user ? <Signup setUser={setUser} /> : <Navigate to="/dashboard" />} 
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Route: Redirect guests back to Login */}
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" />} 
            />
            
            <Route path="/chronicles" element={<Chronicles user={user} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;