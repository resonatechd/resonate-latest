import { Briefcase, Scale, Calculator, Newspaper } from "lucide-react";

const services = [
  {
    icon: Scale,
    title: "UAE Trade License Services",
    desc: "Choose the right mainland, free zone or professional license — with expert guidance, hassle-free registration and provisioning end-to-end.",
    span: "md:col-span-7",
    tone: "dark",
  },
  {
    icon: Briefcase,
    title: "Project Management & Legal Documentation",
    desc: "End-to-end coordination and paperwork — approvals, renewals, amendments and legal documentation, all managed by one dedicated team.",
    span: "md:col-span-5",
    tone: "light",
  },
  {
    icon: Calculator,
    title: "Corporate Tax & Talent Acquisition",
    desc: "Corporate tax registration, VAT and compliance combined with expert manpower recruitment and Indian talent acquisition for UAE businesses.",
    span: "md:col-span-5",
    tone: "gold",
  },
  {
    icon: Newspaper,
    title: "Taxi Visa & Golden Visa Updates",
    desc: "Latest updates and advisory on Sharjah taxi driver placements and the UAE Golden Visa programme — curated for our clients and partners.",
    span: "md:col-span-7",
    tone: "light",
  },
];

function Card({ s }) {
  const Icon = s.icon;
  const base = "group relative p-8 min-h-[240px] flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1";
  const tones = {
    light: "bg-white border hairline",
    dark: "bg-[#2C303A] text-white",
    gold: "bg-[#C5A059] text-white",
  };
  return (
    <article className={`${base} ${tones[s.tone]} ${s.span}`} data-testid={`service-${s.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
      <Icon className={`w-8 h-8 ${s.tone === "light" ? "text-[#C5A059]" : "text-white"}`} strokeWidth={1.4} />
      <div>
        <h3 className="font-serif-display text-2xl leading-tight">{s.title}</h3>
        <p className={`mt-3 text-sm leading-relaxed ${s.tone === "light" ? "text-muted-foreground" : "text-white/80"}`}>{s.desc}</p>
      </div>
    </article>
  );
}

export default function Services() {
  return (
    <section id="services" className="py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between gap-10 mb-12 flex-wrap">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] mb-4">Our Services</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl leading-[1.05] max-w-2xl tracking-tight">
              Four core services, delivered <span className="italic text-[#C5A059]">under one roof.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Nothing extra — only what we do best, tailored for the reality of doing business, hiring and growing in the UAE.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {services.map((s) => (<Card key={s.title} s={s} />))}
        </div>
      </div>
    </section>
  );
}
