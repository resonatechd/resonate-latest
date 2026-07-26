const BUILDING = "/office/compass-building.jpg";
const TEAM = "/office/compass-team.jpg";

export default function CompassOffice() {
  return (
    <section id="compass" className="py-24 bg-background border-b hairline">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] mb-4">Our Home Base</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl leading-[1.05] tracking-tight">
              Compass Co-Working, <span className="italic text-[#C5A059]">Al Hamra · RAK.</span>
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-[#2C303A]">
              Compass Co-working, proudly sponsored by <strong>RAKEZ</strong> and located in Al Hamra, Ras Al Khaimah, is a dedicated business support facility designed for investors establishing their companies in the UAE.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-[#2C303A]">
              Eligible investors can enjoy complimentary access for up to two years, with fully equipped workstations, high-speed Wi-Fi, air-conditioned office space, meeting areas, printing and documentation support, complimentary coffee and refreshments, and other essential business amenities.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-[#2C303A]">
              This initiative reflects RAKEZ's commitment to helping entrepreneurs and businesses grow by providing a professional, collaborative and cost-free working environment during their initial years of operation.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-6">
              {[
                ["Sponsored by", "RAKEZ"],
                ["Complimentary Access", "Up to 2 years"],
                ["Location", "Al Hamra, RAK"],
                ["Amenities", "Full business suite"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{k}</dt>
                  <dd className="font-serif-display text-lg text-[#1A1B1E] mt-1">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-4">
              <div className="relative overflow-hidden aspect-[16/9]">
                <img src={BUILDING} alt="Compass Business Park building" className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 bg-[#1A1B1E]/85 text-white px-4 py-2 backdrop-blur-sm">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059]">Compass Business Park</p>
                  <p className="text-sm font-medium">Al Hamra, Ras Al Khaimah</p>
                </div>
              </div>
              <div className="relative overflow-hidden aspect-[16/9]">
                <img src={TEAM} alt="Compass Co-Working team" className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 bg-[#C5A059] text-white px-4 py-2">
                  <p className="text-[10px] uppercase tracking-[0.25em]">#MyCompassRAK</p>
                  <p className="text-sm font-medium">A collaborative business community</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
