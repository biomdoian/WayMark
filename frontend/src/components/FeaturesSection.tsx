import { motion } from "framer-motion";
import { MapPin, Video, BookOpen, Shield } from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Interactive WayMarks",
    description:
      "Drop pins anywhere on the globe. Each WayMark becomes a rich, interactive marker tied to your story, photos, and driving footage.",
  },
  {
    icon: Video,
    title: "POV Driving Clips",
    description:
      "Upload first-person driving videos and let viewers ride along. See the road through your eyes with seamless media playback.",
  },
  {
    icon: BookOpen,
    title: "Journey Journals",
    description:
      "Write the narrative behind each road. From mountain passes to midnight highways — every mile has a story worth telling.",
  },
  {
    icon: Shield,
    title: "Your Road Chronicles",
    description:
      "Secure accounts keep your journeys private or let you share them with the world. Build a personal atlas of everywhere you've been.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="explore" className="relative py-32 overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-primary text-sm font-body tracking-[0.3em] uppercase">
            Core Features
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4">
            Built for the <span className="text-gradient-amber">Open Road</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto font-body">
            Everything you need to capture, share, and relive your greatest journeys.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-panel rounded-2xl p-8 group hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
