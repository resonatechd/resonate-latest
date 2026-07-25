import { Button } from "../ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useSurveyDialog } from "../../context/SurveyDialogContext";

const TAXI = "https://images.unsplash.com/photo-1630717285906-29364ffacea0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzV8MHwxfHNlYXJjaHwyfHx5ZWxsb3clMjB0YXhpJTIwY2FyfGVufDB8fHx8MTc4NDIxODk1MHww&ixlib=rb-4.1.0&q=85";

export default function TaxiVisa() {
  const { openSurvey } = useSurveyDialog();
  const features = [
    "End-to-End Visa Support",
    "Complete Documentation",
    "Medical & Emirates ID",
    "Quick Processing & Approval",
    "Reliable & Transparent",
    "Trusted by 1000+ Drivers",
  ];
  return (
    <section className="relative bg-[#2C303A] text-white py-24 overflow-hidden">
      <div className="absolute inset-0 grain-overlay opacity-30" />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12 items-center relative">
        <div className="lg:col-span-6">
          <div className="aspect-[5/4] overflow-hidden">
            <img src={TAXI} alt="Sharjah taxi" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="lg:col-span-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] mb-4">Specialty Service</p>
          <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight">
            Sharjah <span className="italic text-[#C5A059]">Taxi Visa</span> Specialists
          </h2>
          <p className="mt-6 text-white/70 max-w-xl leading-relaxed">
            Specialised support for taxi driver recruitment and visa processing across Sharjah. Trusted by more than a thousand drivers for reliable, transparent, and swift processing.
          </p>

          <ul className="mt-8 grid sm:grid-cols-2 gap-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-white/90">
                <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />{f}
              </li>
            ))}
          </ul>

          <Button onClick={openSurvey} className="mt-10 bg-[#C5A059] hover:bg-[#b18d47] text-white rounded-none h-12 px-7" data-testid="taxi-cta">
            Enquire for Taxi Visa <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
