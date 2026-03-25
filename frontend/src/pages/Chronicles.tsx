import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, BookOpen, Plus, ArrowLeft, Clock, Eye, Heart, MessageCircle, Image, X, ChevronRight, Send, Bold, Italic, Heading1, Heading2, List, Quote, Link2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Chronicle {
  id: string;
  title: string;
  subtitle: string;
  coverImageUrl: string;
  body: string;
  linkedWaymarks: { id: string; title: string; lat: number; lng: number }[];
  author: { name: string; avatarUrl: string };
  publishedAt: string;
  readTime: string;
  likes: number;
  comments: number;
  status: "published" | "draft";
}

const mockChronicles: Chronicle[] = [
  {
    id: "1",
    title: "Chasing the Midnight Sun Through Norway's Fjords",
    subtitle: "A 2,000km drive from Bergen to the Lofoten Islands — through tunnels, over mountains, and across the Arctic Circle.",
    coverImageUrl: "",
    body: `The engine hummed steadily as we left Bergen behind, the city's colorful wooden houses shrinking in the rearview mirror. Ahead, the road stretched into a landscape that seemed pulled from a fever dream — sheer cliff faces plunging into crystalline fjords, waterfalls cascading from heights that made your neck ache to look up at.

## Day One: The Hardangervidda Plateau

We hadn't planned to stop so soon, but the Hardangervidda demanded it. At 1,200 meters above sea level, the plateau is Europe's largest — a vast, treeless expanse where the sky meets the earth in every direction. Snow patches lingered even in July, scattered like white islands across the brown-green tundra.

> "There are roads that take you somewhere, and then there are roads that take you *through* something. The Hardangervidda is the latter."

We pulled over at a nameless turnout. The silence was so complete it felt solid, like you could lean against it.

## Day Three: Trollstigen

Nothing prepares you for Trollstigen. You can study the photos, watch the drone footage, trace the hairpin turns on a map — but the moment you crest that first switchback and see the road zigzagging below like a drunk serpent, your brain short-circuits.

The road drops 858 meters over 11 hairpin bends. Each turn reveals a new angle of the Stigfossen waterfall, which roars alongside the road with enough force to shake the car. At the top, we stood on the viewing platform, watching other cars inch their way up like determined beetles.

## Day Seven: Crossing the Arctic Circle

The marker appeared without ceremony — a small globe sculpture on the side of the E6. We had crossed into the Arctic, where the sun would not set for the next three weeks of our journey. The quality of light changed immediately, or maybe that was just knowing. Everything felt gilded, permanent, like the world had decided to pause just for us.`,
    linkedWaymarks: [
      { id: "w1", title: "Trollstigen Summit", lat: 62.47, lng: 7.09 },
      { id: "w2", title: "Hardangervidda Turnout", lat: 60.42, lng: 7.51 },
      { id: "w3", title: "Arctic Circle Marker", lat: 66.56, lng: 15.42 },
    ],
    author: { name: "Alex Explorer", avatarUrl: "" },
    publishedAt: "Aug 20, 2025",
    readTime: "8 min read",
    likes: 124,
    comments: 18,
    status: "published",
  },
  {
    id: "2",
    title: "The Atlantic Road: Where Asphalt Meets the Sea",
    subtitle: "Eight bridges, five islands, and one of the world's most dramatic coastal drives.",
    coverImageUrl: "",
    body: "Draft in progress...",
    linkedWaymarks: [
      { id: "w4", title: "Atlantic Road Bridge", lat: 63.01, lng: 7.36 },
    ],
    author: { name: "Alex Explorer", avatarUrl: "" },
    publishedAt: "Jul 28, 2025",
    readTime: "5 min read",
    likes: 89,
    comments: 7,
    status: "published",
  },
  {
    id: "3",
    title: "Lofoten Nights",
    subtitle: "Driving through the midnight sun in Norway's far north.",
    coverImageUrl: "",
    body: "Work in progress...",
    linkedWaymarks: [],
    author: { name: "Alex Explorer", avatarUrl: "" },
    publishedAt: "",
    readTime: "2 min read",
    likes: 0,
    comments: 0,
    status: "draft",
  },
];

// Simple toolbar button
const ToolbarBtn = ({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    className="h-8 w-8 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
  >
    <Icon className="h-4 w-4" />
  </button>
);

const Chronicles = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<"list" | "read" | "write">("list");
  const [selectedChronicle, setSelectedChronicle] = useState<Chronicle | null>(null);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  // Editor state
  const [editorTitle, setEditorTitle] = useState("");
  const [editorSubtitle, setEditorSubtitle] = useState("");
  const [editorBody, setEditorBody] = useState("");
  const [linkedWaymarks, setLinkedWaymarks] = useState<Chronicle["linkedWaymarks"]>([]);
  const [showWaymarkPicker, setShowWaymarkPicker] = useState(false);

  // Available waymarks to link (mock)
  const availableWaymarks = [
    { id: "w1", title: "Trollstigen Summit", lat: 62.47, lng: 7.09 },
    { id: "w2", title: "Hardangervidda Turnout", lat: 60.42, lng: 7.51 },
    { id: "w3", title: "Arctic Circle Marker", lat: 66.56, lng: 15.42 },
    { id: "w4", title: "Atlantic Road Bridge", lat: 63.01, lng: 7.36 },
    { id: "w5", title: "Faroe Islands Switchback", lat: 62.1, lng: -6.83 },
  ];

  const filteredChronicles = mockChronicles.filter((c) =>
    filter === "all" ? true : c.status === filter
  );

  const openChronicle = (c: Chronicle) => {
    setSelectedChronicle(c);
    setView("read");
  };

  const startWriting = () => {
    setEditorTitle("");
    setEditorSubtitle("");
    setEditorBody("");
    setLinkedWaymarks([]);
    setView("write");
  };

  const editChronicle = (c: Chronicle) => {
    setEditorTitle(c.title);
    setEditorSubtitle(c.subtitle);
    setEditorBody(c.body);
    setLinkedWaymarks(c.linkedWaymarks);
    setSelectedChronicle(c);
    setView("write");
  };

  const insertMarkdown = (syntax: string) => {
    setEditorBody((prev) => prev + syntax);
  };

  // Render markdown-ish body (simple renderer)
  const renderBody = (text: string) => {
    return text.split("\n\n").map((block, i) => {
      if (block.startsWith("## ")) {
        return (
          <h2 key={i} className="font-display text-2xl font-semibold text-foreground mt-10 mb-4">
            {block.replace("## ", "")}
          </h2>
        );
      }
      if (block.startsWith("> ")) {
        return (
          <blockquote key={i} className="border-l-2 border-primary/50 pl-5 my-6 italic text-foreground/70 font-body">
            {block.replace("> ", "")}
          </blockquote>
        );
      }
      return (
        <p key={i} className="text-foreground/80 font-body leading-[1.85] mb-4">
          {block}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <div className="h-14 glass-panel border-b border-border flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {view !== "list" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { setView("list"); setSelectedChronicle(null); }}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2 group">
            <MapPin className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
            <span className="font-display text-lg font-semibold text-foreground tracking-tight">
              Way<span className="text-primary">Mark</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          {view === "list" && (
            <Button variant="hero" size="sm" onClick={startWriting}>
              <Plus className="h-4 w-4 mr-1" />
              New Chronicle
            </Button>
          )}
          {view === "write" && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-border text-muted-foreground" onClick={() => {
                // TODO: Save as draft via your backend API
                console.log("Save draft:", { editorTitle, editorSubtitle, editorBody, linkedWaymarks });
                setView("list");
              }}>
                Save Draft
              </Button>
              <Button variant="hero" size="sm" onClick={() => {
                // TODO: Publish via your backend API
                console.log("Publish:", { editorTitle, editorSubtitle, editorBody, linkedWaymarks });
                setView("list");
              }}>
                <Send className="h-4 w-4 mr-1" />
                Publish
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* LIST VIEW */}
      {view === "list" && (
        <div className="container mx-auto px-4 py-10 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2">Chronicles</h1>
                <p className="text-muted-foreground font-body">Long-form stories from the road.</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-1 mb-8">
              {(["all", "published", "draft"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-body capitalize transition-colors ${
                    filter === f
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Chronicle cards */}
            <div className="space-y-6">
              {filteredChronicles.map((c, index) => (
                <motion.article
                  key={c.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="glass-panel rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-all group cursor-pointer"
                  onClick={() => c.status === "draft" ? editChronicle(c) : openChronicle(c)}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Cover placeholder */}
                    <div className="md:w-56 h-40 md:h-auto bg-secondary flex items-center justify-center flex-shrink-0">
                      <div className="text-center">
                        <Image className="h-8 w-8 text-muted-foreground/30 mx-auto mb-1" />
                        <span className="text-xs text-muted-foreground/40 font-body">Cover</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {c.status === "draft" && (
                            <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full font-body">Draft</span>
                          )}
                          <span className="text-xs text-muted-foreground font-body flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {c.readTime}
                          </span>
                        </div>
                        <h2 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {c.title}
                        </h2>
                        <p className="text-sm text-muted-foreground font-body line-clamp-2">{c.subtitle}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground font-body">
                          {c.linkedWaymarks.length > 0 && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-primary/60" />
                              {c.linkedWaymarks.length} WayMark{c.linkedWaymarks.length > 1 ? "s" : ""}
                            </span>
                          )}
                          {c.publishedAt && <span>{c.publishedAt}</span>}
                        </div>
                        {c.status === "published" && (
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{c.likes}</span>
                            <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{c.comments}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {filteredChronicles.length === 0 && (
              <div className="text-center py-20">
                <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-display text-xl text-foreground mb-2">No chronicles found</h3>
                <p className="text-muted-foreground font-body">
                  {filter === "draft" ? "You have no drafts." : "Start writing your first travel chronicle."}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* READ VIEW */}
      {view === "read" && selectedChronicle && (
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-10 max-w-3xl"
        >
          {/* Header */}
          <header className="mb-10">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground leading-tight mb-4">
              {selectedChronicle.title}
            </h1>
            <p className="text-lg text-muted-foreground font-body leading-relaxed mb-6">
              {selectedChronicle.subtitle}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground font-body">
              <span>{selectedChronicle.author.name}</span>
              <span className="text-border">·</span>
              <span>{selectedChronicle.publishedAt}</span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{selectedChronicle.readTime}</span>
            </div>
          </header>

          {/* Cover placeholder */}
          <div className="w-full h-64 md:h-80 rounded-2xl bg-secondary flex items-center justify-center mb-10 border border-border">
            <div className="text-center text-muted-foreground/40">
              <Image className="h-10 w-10 mx-auto mb-2" />
              <span className="text-sm font-body">Cover image</span>
            </div>
          </div>

          {/* Body */}
          <div className="prose-waymark">
            {renderBody(selectedChronicle.body)}
          </div>

          {/* Linked WayMarks */}
          {selectedChronicle.linkedWaymarks.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                WayMarks in this Chronicle
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {selectedChronicle.linkedWaymarks.map((wm) => (
                  <button
                    key={wm.id}
                    onClick={() => navigate("/explore")}
                    className="glass-panel rounded-lg border border-border p-4 text-left hover:border-primary/30 transition-all group flex items-center justify-between"
                  >
                    <div>
                      <div className="font-body text-sm font-medium text-foreground group-hover:text-primary transition-colors">{wm.title}</div>
                      <div className="text-xs text-muted-foreground/60 font-body mt-0.5">
                        {wm.lat.toFixed(2)}, {wm.lng.toFixed(2)}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Engagement bar */}
          <div className="mt-10 pt-6 border-t border-border flex items-center gap-4">
            <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-primary hover:border-primary/30">
              <Heart className="h-4 w-4 mr-1" />
              {selectedChronicle.likes}
            </Button>
            <Button variant="outline" size="sm" className="border-border text-muted-foreground">
              <MessageCircle className="h-4 w-4 mr-1" />
              {selectedChronicle.comments}
            </Button>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" className="text-primary" onClick={() => editChronicle(selectedChronicle)}>
              Edit Chronicle
            </Button>
          </div>
        </motion.article>
      )}

      {/* WRITE VIEW */}
      {view === "write" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="container mx-auto px-4 py-8 max-w-3xl"
        >
          {/* Title */}
          <input
            type="text"
            value={editorTitle}
            onChange={(e) => setEditorTitle(e.target.value)}
            placeholder="Your chronicle title..."
            className="w-full bg-transparent font-display text-3xl md:text-4xl font-semibold text-foreground placeholder:text-muted-foreground/30 focus:outline-none mb-3"
          />

          {/* Subtitle */}
          <input
            type="text"
            value={editorSubtitle}
            onChange={(e) => setEditorSubtitle(e.target.value)}
            placeholder="A subtitle or teaser line..."
            className="w-full bg-transparent font-body text-lg text-muted-foreground placeholder:text-muted-foreground/20 focus:outline-none mb-8"
          />

          {/* Cover upload placeholder */}
          <div className="w-full h-48 rounded-xl bg-secondary border-2 border-dashed border-border hover:border-primary/30 flex items-center justify-center mb-8 cursor-pointer transition-colors">
            <div className="text-center text-muted-foreground/50">
              <Image className="h-8 w-8 mx-auto mb-2" />
              <span className="text-sm font-body">Click to add cover image</span>
            </div>
          </div>

          {/* Toolbar */}
          <div className="glass-panel rounded-lg border border-border flex items-center gap-0.5 p-1.5 mb-4 sticky top-16 z-40">
            <ToolbarBtn icon={Bold} label="Bold" onClick={() => insertMarkdown("**bold**")} />
            <ToolbarBtn icon={Italic} label="Italic" onClick={() => insertMarkdown("*italic*")} />
            <div className="w-px h-5 bg-border mx-1" />
            <ToolbarBtn icon={Heading1} label="Heading" onClick={() => insertMarkdown("\n\n## ")} />
            <ToolbarBtn icon={Heading2} label="Subheading" onClick={() => insertMarkdown("\n\n### ")} />
            <div className="w-px h-5 bg-border mx-1" />
            <ToolbarBtn icon={Quote} label="Quote" onClick={() => insertMarkdown("\n\n> ")} />
            <ToolbarBtn icon={List} label="List" onClick={() => insertMarkdown("\n- ")} />
            <ToolbarBtn icon={Link2} label="Link" onClick={() => insertMarkdown("[text](url)")} />
            <div className="w-px h-5 bg-border mx-1" />
            <ToolbarBtn icon={Image} label="Image" onClick={() => insertMarkdown("\n\n![alt](image-url)\n\n")} />
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => setShowWaymarkPicker(true)}
              className="flex items-center gap-1.5 px-3 h-8 rounded text-xs font-body text-primary hover:bg-primary/10 transition-colors"
            >
              <MapPin className="h-3.5 w-3.5" />
              Link WayMark
            </button>
          </div>

          {/* Editor body */}
          <textarea
            value={editorBody}
            onChange={(e) => setEditorBody(e.target.value)}
            placeholder="Tell your story...

Use ## for headings, > for quotes. Write freely — your words paint the journey."
            className="w-full min-h-[500px] bg-transparent text-foreground/85 font-body leading-[1.85] placeholder:text-muted-foreground/20 focus:outline-none resize-none"
          />

          {/* Linked WayMarks */}
          {linkedWaymarks.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-3">Linked WayMarks</h4>
              <div className="flex flex-wrap gap-2">
                {linkedWaymarks.map((wm) => (
                  <span
                    key={wm.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-body"
                  >
                    <MapPin className="h-3 w-3" />
                    {wm.title}
                    <button
                      onClick={() => setLinkedWaymarks((prev) => prev.filter((w) => w.id !== wm.id))}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* WayMark picker modal */}
          <AnimatePresence>
            {showWaymarkPicker && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowWaymarkPicker(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="glass-panel rounded-2xl border border-border p-6 w-full max-w-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg font-semibold text-foreground">Link a WayMark</h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowWaymarkPicker(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {availableWaymarks
                      .filter((wm) => !linkedWaymarks.some((lw) => lw.id === wm.id))
                      .map((wm) => (
                        <button
                          key={wm.id}
                          onClick={() => {
                            setLinkedWaymarks((prev) => [...prev, wm]);
                            setShowWaymarkPicker(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                        >
                          <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                            <MapPin className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-body text-foreground">{wm.title}</div>
                            <div className="text-xs text-muted-foreground font-body">{wm.lat.toFixed(2)}, {wm.lng.toFixed(2)}</div>
                          </div>
                        </button>
                      ))}
                    {availableWaymarks.filter((wm) => !linkedWaymarks.some((lw) => lw.id === wm.id)).length === 0 && (
                      <p className="text-sm text-muted-foreground font-body text-center py-4">All WayMarks are already linked.</p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default Chronicles;
