const steps = [
  { n: "01", title: "Free Consultation", desc: "We understand your requirements and recommend the right solution." },
  { n: "02", title: "Documentation", desc: "We collect, prepare and verify every required document." },
  { n: "03", title: "Application Processing", desc: "We handle submissions and government approvals on your behalf." },
  { n: "04", title: "Completion", desc: "Receive your trade license, visa or service — with ongoing support." },
];

export default function Process() {
  return (
    <section id="process" className="py-24 bg-accent/40 border-y hairline">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-14 max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] mb-4">Our Process</p>
          <h2 className="font-serif-display text-4xl sm:text-5xl leading-[1.05] tracking-tight">
            A calm, four-step <span className="italic text-[#C5A059]">journey.</span>
          </h2>
        </div>
        <ol className="grid md:grid-cols-4 gap-0 border-t hairline">
          {steps.map((s) => (
            <li key={s.n} className="p-8 border-r hairline last:border-r-0 bg-white/60 backdrop-blur-sm" data-testid={`step-${s.n}`}>
              <p className="font-serif-display italic text-6xl text-[#C5A059] leading-none">{s.n}</p>
              <h3 className="mt-6 font-serif-display text-2xl">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
