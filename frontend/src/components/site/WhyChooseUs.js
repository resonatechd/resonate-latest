import { Award, Clock, Handshake, ShieldCheck, Sparkles, UserRoundCheck } from "lucide-react";

const items = [
  { icon: Award, title: "UAE Registered Company", desc: "Fully licensed business with a valid trade license until March 2027." },
  { icon: UserRoundCheck, title: "Experienced Consultants", desc: "7 years of hands-on experience across mainland, free zone and PRO services." },
  { icon: Clock, title: "Fast Processing", desc: "Streamlined submission pipelines to shorten government approval timelines." },
  { icon: ShieldCheck, title: "Transparent Pricing", desc: "No hidden costs. Clear breakdowns before you commit to any service." },
  { icon: Handshake, title: "Personalised Consultation", desc: "Every client receives a tailored plan based on their business or visa objective." },
  { icon: Sparkles, title: "End-to-End Documentation", desc: "From first application to renewal — we own the paperwork so you don't have to." },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] mb-4">Why Choose Us</p>
          <h2 className="font-serif-display text-4xl sm:text-5xl leading-[1.05] tracking-tight">
            Your trusted <span className="italic text-[#C5A059]">UAE business partner.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            We simplify UAE business setup and corporate services with transparent guidance and professional support at every step.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <div key={it.title} className="group" data-testid={`why-${it.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
                <div className="w-12 h-12 flex items-center justify-center border hairline bg-white group-hover:bg-[#C5A059] group-hover:border-[#C5A059] transition-colors duration-300">
                  <Icon className="w-5 h-5 text-[#C5A059] group-hover:text-white transition-colors" strokeWidth={1.6} />
                </div>
                <h3 className="mt-5 font-serif-display text-2xl leading-tight">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
