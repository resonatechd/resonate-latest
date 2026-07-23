import { Button } from "../ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

const SKYLINE = "https://images.unsplash.com/photo-1651467606797-e1c660cf3fda?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwzfHxkdWJhaSUyMHNreWxpbmUlMjBsdXh1cnl8ZW58MHx8fHwxNzg0MjE4OTUwfDA&ixlib=rb-4.1.0&q=85";

export default function Hero() {
  return (
    <section id="top" className="pt-24 pb-16 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 fade-in-up">
          <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-[#C5A059] mb-6">
            <span className="w-6 h-px bg-[#C5A059]" /> UAE Business & Visa Experts
          </p>
          <h1 className="font-serif-display text-5xl sm:text-6xl lg:text-[76px] leading-[1.02] tracking-tight text-[#1A1B1E]">
            Business Setup & Visa Experts
            <br />
            in the <span className="italic text-[#C5A059]">United Arab Emirates.</span>
          </h1>
          <p className="mt-8 max-w-xl text-base text-muted-foreground leading-relaxed">
            Helping entrepreneurs, professionals, and businesses establish and grow in the UAE — with reliable business setup, visa processing, corporate tax, and manpower solutions under one roof.
          </p>

          <ul className="mt-8 grid sm:grid-cols-2 gap-3 max-w-xl">
            {[
              "UAE Trade License Services",
              "Visa & Immigration Assistance",
              "Corporate Documentation",
              "End-to-End Business Support",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-[#2C303A]">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059] mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild className="bg-[#C5A059] hover:bg-[#b18d47] text-white rounded-none h-12 px-7 text-sm" data-testid="hero-cta-consultation">
              <a href="#counselling">Get Free Consultation <ArrowRight className="w-4 h-4 ml-2" /></a>
            </Button>
            <Button asChild variant="outline" className="rounded-none border-[#2C303A] text-[#2C303A] hover:bg-[#2C303A] hover:text-white h-12 px-7 text-sm" data-testid="hero-cta-expert">
              <a href="#counselling">Talk to an Expert</a>
            </Button>
          </div>

          <div className="mt-12 flex items-center gap-8 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <div><span className="font-serif-display text-3xl text-[#1A1B1E] block leading-none">7+</span>Years experience</div>
            <div className="w-px h-8 bg-border" />
            <div><span className="font-serif-display text-3xl text-[#1A1B1E] block leading-none">1000+</span>Drivers served</div>
            <div className="w-px h-8 bg-border" />
            <div><span className="font-serif-display text-3xl text-[#1A1B1E] block leading-none">2027</span>License valid till</div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img src={SKYLINE} alt="Dubai skyline" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C303A]/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059]">Head Office</p>
              <p className="font-serif-display text-2xl leading-tight mt-1">Compass Co-Working, Al Hamra,<br/>Ras Al Khaimah, UAE</p>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 bg-[#2C303A] text-white p-6 max-w-[220px] hidden lg:block">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059]">Trade License</p>
            <p className="font-serif-display text-3xl leading-none mt-2">Valid till<br/>March 2027</p>
          </div>
        </div>
      </div>
    </section>
  );
}
