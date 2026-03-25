import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
            The Road is Calling
          </h2>
          <p className="text-muted-foreground font-body text-lg max-w-lg mx-auto mb-10">
            Start dropping WayMarks and building your road chronicle today.
            It's free to begin.
          </p>
          <Button variant="hero" size="lg" className="text-base px-10 py-6">
            Begin Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
