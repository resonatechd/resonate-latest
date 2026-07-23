import { API } from "../../lib/api";
import { Badge } from "../ui/badge";
import { PlayCircle, Sparkles } from "lucide-react";

const CATEGORY_LABEL = {
  visa: "Visa Issued",
  company: "New Company",
  video: "Video",
  announcement: "Announcement",
};

const SEED = [
  {
    id: "seed-1",
    title: "Investor Visa approved for a Dubai retail founder",
    description: "Full documentation and approval completed within 12 working days.",
    category: "visa",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "seed-2",
    title: "New Free Zone company opened in RAKEZ",
    description: "Trade license issued for a consulting SME under a general trading activity.",
    category: "company",
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: "seed-3",
    title: "20 Sharjah taxi driver visas processed this week",
    description: "Ongoing partnership continues — trusted by 1000+ drivers across the emirate.",
    category: "visa",
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
];

function timeAgo(iso) {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString();
}

export default function DynamicUpdates({ updates = [] }) {
  const items = updates.length ? updates : SEED;
  return (
    <section id="updates" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Live From Our Desk
            </p>
            <h2 className="font-serif-display text-4xl sm:text-5xl leading-[1.05] tracking-tight max-w-2xl">
              Recent visas, new companies, and <span className="italic text-[#C5A059]">success stories.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            A running feed of what we're processing for clients — updated as our team ships wins.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.slice(0, 9).map((u) => {
            const isImage = u.media_type?.startsWith("image/");
            const isVideo = u.media_type?.startsWith("video/");
            return (
              <article key={u.id} className="group border hairline bg-white overflow-hidden flex flex-col" data-testid={`update-item-${u.id}`}>
                <div className="relative aspect-[4/3] bg-accent/60 overflow-hidden">
                  {isImage && u.media_path && (
                    <img src={`${API}/files/${u.media_path}`} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  )}
                  {isVideo && u.media_path && (
                    <>
                      <video src={`${API}/files/${u.media_path}`} className="w-full h-full object-cover" muted playsInline controls />
                      <div className="absolute top-3 right-3 bg-[#2C303A] text-white text-[10px] uppercase tracking-widest px-2 py-1 flex items-center gap-1">
                        <PlayCircle className="w-3 h-3" /> Video
                      </div>
                    </>
                  )}
                  {!u.media_path && (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-serif-display text-6xl italic text-[#C5A059]/40">.</span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="border-[#C5A059] text-[#C5A059] rounded-none text-[10px] uppercase tracking-widest">
                      {CATEGORY_LABEL[u.category] || u.category}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">{timeAgo(u.created_at)}</span>
                  </div>
                  <h3 className="font-serif-display text-xl leading-snug">{u.title}</h3>
                  {u.description && <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">{u.description}</p>}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
