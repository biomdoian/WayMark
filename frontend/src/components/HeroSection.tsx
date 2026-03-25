import { motion } from "framer-motion";
import { Play, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-road.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Winding mountain road at golden hour"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      </div>

      {/* Floating amber particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/40"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 8}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <div className="h-px w-8 bg-primary/50" />
          <span className="text-primary text-sm font-body tracking-[0.3em] uppercase">
            Every Road Tells a Story
          </span>
          <div className="h-px w-8 bg-primary/50" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground leading-[0.95] mb-6"
        >
          Drop a Pin.
          <br />
          <span className="text-gradient-amber">Tell the Story.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Document your journeys with interactive WayMarks on the map.
          Attach POV driving clips, photos, and the stories that make
          every mile unforgettable.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button variant="hero" size="lg" className="text-base px-8 py-6" asChild>
            <Link to="/explore">
              <MapPin className="mr-2 h-5 w-5" />
              Start Your Chronicle
            </Link>
          </Button>
          <Button variant="heroOutline" size="lg" className="text-base px-8 py-6">
            <Play className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-20 glass-panel rounded-2xl p-6 max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-3 divide-x divide-border">
            {[
              { value: "12K+", label: "WayMarks Dropped" },
              { value: "3.4K", label: "Road Chronicles" },
              { value: "89", label: "Countries" },
            ].map((stat) => (
              <div key={stat.label} className="text-center px-4">
                <div className="font-display text-2xl md:text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1 font-body">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
