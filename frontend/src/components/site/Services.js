import {
  Briefcase, Users, Stamp, Calculator, Megaphone,
} from "lucide-react";

const services = [
  {
    icon: Briefcase,
    title: "Project Management & Documentation",
    desc: "End-to-end coordination and paperwork — approvals, renewals, amendments and legal documentation handled by a single team.",
    span: "md:col-span-7",
    tone: "dark",
  },
  {
    icon: Users,
    title: "Manpower Solutions & Talent Acquisition",
    desc: "Recruiting skilled professionals across industries and connecting candidates to UAE opportunities.",
    span: "md:col-span-5",
    tone: "light",
  },
  {
    icon: Stamp,
    title: "UAE Trade License — Suggestion & Provision",
    desc: "We recommend and provision the right mainland, free zone or professional license for your activity.",
    span: "md:col-span-5",
    tone: "gold",
  },
  {
    icon: Calculator,
    title: "Corporate Tax & Typing Services",
    desc: "Corporate tax registration, VAT support, PRO and government typing services — fully compliant, hassle-free.",
    span: "md:col-span-7",
    tone: "light",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing & Meta Tools",
    desc: "Meta ads, lead generation, branding and online presence management for UAE businesses.",
    span: "md:col-span-12",
    tone: "dark",
  },
];

function Card({ s }) {
  const Icon = s.icon;
  const base = "group relative p-8 min-h-[220px] flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1";
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
              Five core services, delivered <span className="italic text-[#C5A059]">under one roof.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Nothing extra — only what we do best, tailored for the reality of doing business and working in the UAE.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {services.map((s) => (<Card key={s.title} s={s} />))}
        </div>
      </div>
    </section>
  );
}
