import { motion } from "framer-motion";
import WayMarkMap from "./WayMarkMap"; // Import the map component
import povDrive from "@/assets/pov-drive.jpg";

const MapShowcase = () => {
  return (
    <section id="chronicles" className="relative py-32">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — LIVE MAP REPLACE HERE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="glass-panel rounded-2xl overflow-hidden border border-border" style={{ boxShadow: "var(--shadow-elevated)" }}>
              {/* REPLACED IMAGE WITH LIVE MAP */}
              <WayMarkMap />
            </div>

            {/* Floating waymark card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -bottom-6 -right-4 md:right-8 glass-panel rounded-xl p-4 max-w-[220px] z-10"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                <span className="text-xs text-primary font-body font-medium">Live WayMark</span>
              </div>
              <p className="text-xs text-muted-foreground font-body">
                "The Rift Valley escarpment was misty as I passed Mai Mahiu..."
              </p>
            </motion.div>
          </motion.div>

          {/* Right — Text stays the same */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-primary text-sm font-body tracking-[0.3em] uppercase">Your Atlas</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6">
              Map Your <span className="text-gradient-amber">Memories</span>
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed mb-8">
              Every pin you drop becomes a time capsule — your POV footage, 
              your words, your road. WayMark turns your Kenyan road trips into interactive stories.
            </p>

            <div className="glass-panel rounded-2xl overflow-hidden border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
              <img src={povDrive} alt="POV driving" className="w-full h-auto opacity-80" loading="lazy" />
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-[10px] text-primary font-bold">IB</span>
                  </div>
                  <span>Ian Biomdo</span>
                  <span className="text-border">•</span>
                  <span>Great Rift Valley, KE</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MapShowcase;