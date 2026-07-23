import { Star } from "lucide-react";

function Stars({ n }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-[#F4B400] text-[#F4B400]" />
      ))}
    </div>
  );
}

export default function Reviews({ reviews = [] }) {
  if (reviews.length === 0) return null;
  return (
    <section id="reviews" className="py-24 bg-accent/40 border-y hairline">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] mb-4">Client Reviews</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl leading-[1.05] tracking-tight max-w-2xl">
              Rated <span className="italic text-[#C5A059]">5-star</span> by clients across the UAE.
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <svg width="26" height="26" viewBox="0 0 24 24" className="shrink-0"><path fill="#4285F4" d="M22 12.2c0-.8-.1-1.4-.2-2.1H12v3.9h5.7c-.1 1-.7 2.4-2 3.4l-.02.12 2.9 2.24.2.02c1.85-1.7 2.92-4.2 2.92-7.2Z"/><path fill="#34A853" d="M12 22c2.7 0 4.9-.9 6.6-2.4l-3.1-2.4c-.8.6-1.9 1-3.5 1-2.7 0-5-1.8-5.8-4.3l-.12.01-3.03 2.33-.04.11C4.6 19.6 8 22 12 22Z"/><path fill="#FBBC04" d="M6.2 13.9c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2l-.006-.13-3.07-2.38-.1.05C2.4 8.6 2 10.2 2 12s.4 3.4 1.03 4.56L6.2 13.9Z"/><path fill="#EA4335" d="M12 5.9c1.9 0 3.2.8 3.9 1.5l2.9-2.8C17 3 14.7 2 12 2 8 2 4.6 4.4 3 7.5l3.2 2.4C7 7.7 9.3 5.9 12 5.9Z"/></svg>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Powered by</p>
              <p className="font-serif-display text-lg">Google Reviews</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((r) => (
            <article key={r.id} className="bg-white border hairline p-6" data-testid={`review-${r.id}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-serif-display text-lg" style={{ background: r.avatar_color }}>
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm">{r.name}</p>
                  <p className="text-[11px] text-muted-foreground">{r.date}</p>
                </div>
              </div>
              <div className="mt-4"><Stars n={r.rating} /></div>
              <p className="mt-3 text-sm text-[#2C303A] leading-relaxed">{r.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
