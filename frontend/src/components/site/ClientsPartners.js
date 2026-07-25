const CLIENTS = [
  {
    name: "The Crown Restaurant Ajman",
    logo: "/clients/TheCrownRestaurantAjman.png",
    quote: "Resonate delivers reliable manpower and satisfactory services.",
  },
  {
    name: "Victory Line Financial Services LLC Dubai",
    logo: "/clients/VictoryLineFinancialServicesLLCDubai.png",
    quote: "Professional documentation & consistent client support.",
  },
  {
    name: "Sharjah Taxi, Sharjah",
    logo: "/clients/SharjahTaxiSharjah.png",
    quote: "Trusted partner for taxi driver visa processing at scale.",
  },
  {
    name: "Star Marine Logistics Ajman",
    logo: "/clients/StarMarineLogisticsAjman.png",
    quote: "Skilled hands, delivered on time, every time.",
  },
  {
    name: "West Zone Group Ajman",
    logo: "/clients/WestZoneGroupAjman.png",
    quote: "Dependable manpower solutions across retail operations.",
  },
  {
    name: "Zafran Tea Restaurant Ajman",
    logo: "/clients/ZafranTeaRestaurantAjmanOwner.jpg",
    quote: "Excellent service and long-standing partnership.",
  },
  {
    name: "Al Khairat Cleaning Services",
    logo: "/clients/AlKhairatCleaningServices.png",
    quote: "Genuine consultancy — no false promises.",
  },
  {
    name: "Al Arabia Taxi, RAK",
    logo: "/clients/AlArabiaTaxiRAK.png",
    quote: "End-to-end driver onboarding, done right.",
  },
];

const PARTNERS = [
  "Harf Group Ras Al Khaimah",
  "RAKEZ, UAE",
  "Nebula Agency Hyderabad",
  "Falcon Gateways",
  "VIP Atlantic Nangal",
  "Skyhigh Hyderabad",
  "Patwa Brothers, Rohtak",
];

function ClientCard({ c }) {
  const initials = c.name.split(" ").filter(Boolean).slice(0, 2).map((w) => w.charAt(0)).join("");
  return (
    <article
      className="flex flex-col items-center text-center group"
      data-testid={`client-${c.name.toLowerCase().replace(/[^a-z]+/g, "-")}`}
    >
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-accent bg-white shadow-sm group-hover:border-[#C5A059] transition-colors duration-300 relative">
        <img
          src={c.logo}
          alt={c.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
        <div className="absolute inset-0 flex items-center justify-center font-serif-display text-3xl italic text-[#C5A059]/60 pointer-events-none -z-0">
          {initials}
        </div>
      </div>
      <h4 className="mt-4 font-serif-display text-lg leading-tight">{c.name}</h4>
      <p className="mt-1 text-xs text-muted-foreground/80 italic max-w-[220px]">{c.quote}</p>
    </article>
  );
}

export default function ClientsPartners() {
  return (
    <section id="clients" className="py-24 bg-accent/40 border-y hairline">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-14 max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] mb-4">Leading Clients</p>
          <h2 className="font-serif-display text-4xl sm:text-5xl leading-[1.05] tracking-tight">
            Businesses who <span className="italic text-[#C5A059]">trust Resonate</span> across the Emirates.
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-6">
          {CLIENTS.map((c) => (<ClientCard key={c.name} c={c} />))}
        </div>

        <div className="mt-24">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] mb-4">Channel Partners</p>
          <h3 className="font-serif-display text-3xl sm:text-4xl leading-[1.05] tracking-tight max-w-2xl">
            A trusted network across the <span className="italic text-[#C5A059]">UAE and India.</span>
          </h3>
          <ul className="mt-8 flex flex-wrap gap-x-3 gap-y-3">
            {PARTNERS.map((p) => (
              <li
                key={p}
                className="px-5 py-2 bg-white border hairline text-sm font-medium hover:border-[#C5A059] hover:text-[#C5A059] transition-colors"
                data-testid={`partner-${p.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              >
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
