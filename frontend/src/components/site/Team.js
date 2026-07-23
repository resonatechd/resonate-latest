const TEAM = [
  {
    name: "Mr. Khanna",
    role: "Founder & Managing Consultant",
    bio: "7 years of UAE business consulting experience. Leads strategy and client relations.",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=srgb&fm=jpg&w=800&q=80",
  },
  {
    name: "Layla Al Suwaidi",
    role: "Head of Visa Operations",
    bio: "Oversees all visa & Emirates ID processing, medicals and biometrics coordination.",
    img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=srgb&fm=jpg&w=800&q=80",
  },
  {
    name: "Rohan Mehta",
    role: "Corporate Tax & PRO Lead",
    bio: "Manages tax registration, VAT and government typing / PRO services end-to-end.",
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?crop=entropy&cs=srgb&fm=jpg&w=800&q=80",
  },
  {
    name: "Sana Iqbal",
    role: "Digital Marketing Director",
    bio: "Runs Meta ads, lead generation and branding for UAE-based clients.",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=srgb&fm=jpg&w=800&q=80",
  },
];

export default function Team() {
  return (
    <section id="team" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] mb-4">Meet The Team</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl leading-[1.05] tracking-tight max-w-xl">
              The people behind your <span className="italic text-[#C5A059]">UAE setup.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            A small, specialised team — each responsible for a discipline critical to your business in the Emirates.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TEAM.map((t) => (
            <article key={t.name} className="group" data-testid={`team-${t.name.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
              <div className="aspect-[4/5] overflow-hidden bg-accent">
                <img src={t.img} alt={t.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-[filter] duration-500" />
              </div>
              <h3 className="mt-4 font-serif-display text-xl">{t.name}</h3>
              <p className="text-[11px] uppercase tracking-widest text-[#C5A059] mt-1">{t.role}</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
