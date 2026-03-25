import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Plus, ArrowLeft, Send, Loader2, Play, Clock, Heart, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Chronicle {
  id: string;
  title: string;
  subtitle: string;
  video_url?: string;
  body: string;
  linkedWaymarks: { id: string; title: string; lat: number; lng: number }[];
  author: { name: string; avatarUrl: string };
  publishedAt: string;
  status: "published" | "draft";
}

interface ChroniclesProps {
  user: any;
}

const Chronicles = ({ user }: ChroniclesProps) => {
  const [view, setView] = useState<"list" | "read" | "write">("list");
  const [selectedChronicle, setSelectedChronicle] = useState<Chronicle | null>(null);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [chronicles, setChronicles] = useState<Chronicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // EDITOR STATE
  const [editorTitle, setEditorTitle] = useState("");
  const [editorSubtitle, setEditorSubtitle] = useState("");
  const [editorBody, setEditorBody] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const chronRes = await fetch("http://127.0.0.1:5555/chronicles");
      const chronData = await chronRes.json();
      setChronicles(chronData);
    } catch (err) {
      toast.error("Failed to load chronicles from server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [view]);

  const handlePublish = async () => {
    if (!editorTitle || !editorBody) {
      toast.error("Please provide at least a title and a story body.");
      return;
    }

    const payload = {
      title: editorTitle,
      subtitle: editorSubtitle,
      body: editorBody,
      status: "published",
      user_id: user?.id || 1, // Uses your actual logged-in ID
    };

    try {
      const res = await fetch("http://127.0.0.1:5555/chronicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success("Chronicle published!");
        setEditorTitle("");
        setEditorSubtitle("");
        setEditorBody("");
        setView("list");
      }
    } catch (err) {
      toast.error("Failed to save chronicle.");
    }
  };

  const filteredChronicles = chronicles.filter((c) =>
    filter === "all" ? true : c.status === filter
  );

  const renderBody = (text: string) => {
    if (!text) return null;
    return text.split("\n\n").map((block, i) => {
      if (block.startsWith("## ")) {
        return <h2 key={i} className="font-display text-2xl font-semibold mt-10 mb-4">{block.replace("## ", "")}</h2>;
      }
      if (block.startsWith("> ")) {
        return <blockquote key={i} className="border-l-2 border-primary/50 pl-5 my-6 italic text-foreground/70 font-body">{block.replace("> ", "")}</blockquote>;
      }
      return <p key={i} className="text-foreground/80 font-body leading-[1.85] mb-4">{block}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAVIGATION BAR */}
      <div className="h-14 glass-panel border-b border-border flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {view !== "list" && (
            <Button variant="ghost" size="icon" onClick={() => { setView("list"); setSelectedChronicle(null); }} className="text-muted-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-semibold">Way<span className="text-primary">Mark</span></span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {view === "list" && (
            <Button variant="hero" size="sm" onClick={() => setView("write")}>
              <Plus className="h-4 w-4 mr-1" /> New Chronicle
            </Button>
          )}
          {view === "write" && (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setView("list")}>Cancel</Button>
              <Button variant="hero" size="sm" onClick={handlePublish}>
                <Send className="h-4 w-4 mr-1" /> Publish
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* LIST VIEW */}
      {view === "list" && (
        <div className="container mx-auto px-4 py-10 max-w-4xl">
          <div className="mb-8">
            <h1 className="font-display text-4xl font-semibold mb-2">Chronicles</h1>
            <p className="text-muted-foreground font-body">POV driving stories and travel logs from the community.</p>
          </div>

          <div className="flex gap-1 mb-8">
            {(["all", "published", "draft"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${filter === f ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary"}`}
              >
                {f}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
          ) : (
            <div className="grid gap-6">
              {filteredChronicles.map((c) => (
                <motion.article
                  key={c.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  className="glass-panel rounded-xl border border-border overflow-hidden hover:border-primary/40 transition-all cursor-pointer group"
                  onClick={() => { setSelectedChronicle(c); setView("read"); }}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-64 h-44 bg-secondary flex items-center justify-center border-r border-border relative overflow-hidden">
                       {c.video_url ? (
                         <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                           <Play className="h-10 w-10 text-white opacity-80" />
                         </div>
                       ) : (
                         <Video className="h-10 w-10 text-muted-foreground/20" />
                       )}
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">{c.title}</h2>
                        {c.video_url && <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">POV Video</span>}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-6">{c.subtitle}</p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/40">
                        <div className="flex gap-4 items-center">
                          <span className="font-medium text-foreground/70">{c.author.name}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3"/> 5 min read</span>
                        </div>
                        <div className="flex gap-3">
                           <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> 24</span>
                           <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.linkedWaymarks?.length || 0} WayMarks</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* READ VIEW */}
      {view === "read" && selectedChronicle && (
        <article className="container mx-auto px-4 py-10 max-w-3xl">
          <header className="mb-10 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{selectedChronicle.title}</h1>
            <p className="text-xl text-muted-foreground mb-6 font-body italic">"{selectedChronicle.subtitle}"</p>
            <div className="flex justify-center items-center gap-4 text-sm text-muted-foreground font-body">
              <span className="text-primary font-semibold">{selectedChronicle.author.name}</span>
              <span>•</span>
              <span>{new Date(selectedChronicle.publishedAt).toLocaleDateString()}</span>
            </div>
          </header>

          {selectedChronicle.video_url && (
            <div className="aspect-video w-full rounded-2xl overflow-hidden mb-12 border border-border bg-black shadow-2xl">
              <video 
                src={selectedChronicle.video_url} 
                controls 
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <div className="prose prose-invert max-w-none mb-16 font-body text-lg leading-relaxed">
            {renderBody(selectedChronicle.body)}
          </div>

          {selectedChronicle.linkedWaymarks.length > 0 && (
            <div className="border-t border-border pt-8">
              <h3 className="font-display text-2xl font-semibold mb-6 flex items-center gap-2">
                <MapPin className="text-primary" /> Route Waymarks
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {selectedChronicle.linkedWaymarks.map(wm => (
                  <div key={wm.id} className="p-4 glass-panel border border-border rounded-xl flex justify-between items-center hover:border-primary/50 transition-all">
                    <span className="font-medium">{wm.title}</span>
                    <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-1 rounded">COORD: {wm.lat.toFixed(2)}, {wm.lng.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      )}

      {/* WRITE VIEW */}
      {view === "write" && (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <input 
            className="w-full bg-transparent font-display text-4xl font-bold focus:outline-none mb-4 border-b border-transparent focus:border-primary/20 pb-2" 
            placeholder="Title of your story..." 
            value={editorTitle} 
            onChange={(e) => setEditorTitle(e.target.value)} 
          />
          <input 
            className="w-full bg-transparent text-xl text-muted-foreground focus:outline-none mb-8 italic" 
            placeholder="An intriguing subtitle..." 
            value={editorSubtitle} 
            onChange={(e) => setEditorSubtitle(e.target.value)} 
          />
          <textarea 
            className="w-full min-h-[450px] bg-transparent text-lg leading-relaxed focus:outline-none resize-none font-body" 
            placeholder="Tell your POV driving story... (use '##' for headers)" 
            value={editorBody} 
            onChange={(e) => setEditorBody(e.target.value)} 
          />
        </div>
      )}
    </div>
  );
};

export default Chronicles;