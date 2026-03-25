import { MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-semibold text-foreground">
              Way<span className="text-primary">Mark</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-body">
            © 2026 WayMark. Every Road Tells a Story.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-body"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
