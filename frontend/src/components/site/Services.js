import {
  FileText, Building2, Stamp, Users, Calculator, Megaphone, IdCard,
} from "lucide-react";

const services = [
  {
    icon: Stamp,
    title: "UAE Trade License",
    desc: "Mainland, free zone or professional licenses — with expert guidance and hassle-free registration.",
    span: "md:col-span-5",
    tone: "light",
  },
  {
    icon: Building2,
    title: "Business Setup & Corporate Documentation",
    desc: "Company registration, approvals, renewals, amendments and legal paperwork end-to-end.",
    span: "md:col-span-7",
    tone: "dark",
  },
  {
    icon: IdCard,
    title: "Visa Services",
    desc: "Employment, Investor, Partner, Family, Emirates ID, Medical & Biometrics, Renewals.",
    span: "md:col-span-4",
    tone: "gold",
  },
  {
    icon: Users,
    title: "Manpower & Talent Acquisition",
    desc: "Recruiting skilled professionals across industries and connecting candidates to UAE opportunities.",
    span: "md:col-span-4",
    tone: "light",
  },
  {
    icon: Calculator,
    title: "Corporate Tax & PRO Services",
    desc: "Tax registration, VAT support, government typing services, PRO & compliance documentation.",
    span: "md:col-span-4",
    tone: "light",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    desc: "Meta ads, lead generation, branding and online presence management for UAE businesses.",
    span: "md:col-span-7",
    tone: "light",
  },
  {
    icon: FileText,
    title: "Documentation & Attestation",
    desc: "MOFA, notarisation, translation and legal attestation for personal and corporate documents.",
    span: "md:col-span-5",
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
              Complete business support for the UAE, under <span className="italic text-[#C5A059]">one roof.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Seven core service lines built around the reality of doing business in the Emirates — from your first idea to your first invoice, and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {services.map((s) => (<Card key={s.title} s={s} />))}
        </div>
      </div>
    </section>
  );
}
