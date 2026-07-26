export default function About() {
  return (
    <section id="about" className="py-24 bg-accent/40 border-y hairline">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] mb-4">About Resonate.Dubai</p>
          <h2 className="font-serif-display text-4xl sm:text-5xl leading-[1.05] tracking-tight">
            One partner. Every step in your <span className="italic text-[#C5A059]">UAE journey.</span>
          </h2>
        </div>
        <div className="lg:col-span-7 space-y-6 text-[15px] leading-relaxed text-[#2C303A]">
          <p>
            Resonate Dubai LLC is a UAE-registered project management and manpower recruitment consultancy founded by <strong>MR. KHANNA</strong>, dedicated to helping entrepreneurs, professionals and companies establish and grow their presence across the Emirates. With 6+ years of industry experience and a valid trade license until March 2027, we operate across the GCC with deep roots in the UAE.
          </p>
          <p>
            From choosing the right business license to project management, legal documentation, corporate tax compliance, talent acquisition and manpower recruitment — we provide complete business support under one roof. Our mission is to simplify complex government procedures and deliver reliable, transparent and efficient business support.
          </p>
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6">
            {[
              ["UAE Registered", "Firm & LLC"],
              ["Trade License", "Valid · Mar 2027"],
              ["Region", "GCC"],
              ["Experience", "6+ Years"],
              ["Head Office", "RAK, UAE"],
              ["Founder", "MR. KHANNA"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{k}</dt>
                <dd className="font-serif-display text-lg text-[#1A1B1E] mt-1">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="text-xs text-muted-foreground mt-8">
            Compass Co-Working Space, Al Jazeera Al Hamra Industry, Ras Al Khaimah, United Arab Emirates.
          </p>
        </div>
      </div>
    </section>
  );
}
