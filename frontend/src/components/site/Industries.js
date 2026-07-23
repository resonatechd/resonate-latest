const industries = [
  "Transport", "Construction", "Hospitality", "Retail", "Healthcare",
  "IT & Software", "Trading", "Professional Services", "Startups", "SMEs",
  "Real Estate", "Manufacturing",
];

export default function Industries() {
  return (
    <section className="py-20 bg-[#1A1B1E] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] mb-3">Industries We Support</p>
            <h2 className="font-serif-display text-3xl sm:text-4xl leading-tight max-w-xl">
              Business & professionals across every UAE sector.
            </h2>
          </div>
        </div>
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6">
          {industries.map((i, idx) => (
            <li
              key={i}
              className="border-b hairline border-white/10 py-5 flex items-center gap-4 text-lg"
              data-testid={`industry-${i.toLowerCase().replace(/[^a-z]+/g, "-")}`}
            >
              <span className="text-[#C5A059] font-serif-display text-sm tracking-widest">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="font-serif-display">{i}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
