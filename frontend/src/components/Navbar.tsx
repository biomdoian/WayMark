import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = ["Explore", "Chronicles", "Community", "About"];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass-panel"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <a href="/" className="flex items-center gap-2 group">
          <MapPin className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
          <span className="font-display text-xl font-semibold text-foreground tracking-tight">
            Way<span className="text-primary">Mark</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const href = item === "Chronicles" ? "/chronicles" : item === "Explore" ? "/explore" : `#${item.toLowerCase()}`;
            const Comp = href.startsWith("/") ? Link : "a";
            return (
              <Comp
                key={item}
                to={href.startsWith("/") ? href : undefined}
                href={!href.startsWith("/") ? href : undefined}
                className="text-sm font-body text-muted-foreground hover:text-primary transition-colors tracking-wide"
              >
                {item}
              </Comp>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/explore">Start Journey</Link>
          </Button>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass-panel border-t border-border overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {navItems.map((item) => {
                const href = item === "Chronicles" ? "/chronicles" : item === "Explore" ? "/explore" : `#${item.toLowerCase()}`;
                const Comp = href.startsWith("/") ? Link : "a";
                return (
                  <Comp
                    key={item}
                    to={href.startsWith("/") ? href : undefined}
                    href={!href.startsWith("/") ? href : undefined}
                    className="text-sm text-muted-foreground hover:text-primary py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item}
                  </Comp>
                );
              })}
              <div className="flex gap-3 pt-2">
                <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button variant="hero" size="sm" className="flex-1" asChild>
                  <Link to="/explore">Start Journey</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
