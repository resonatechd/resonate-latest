import { Button } from "../ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useSurveyDialog } from "../../context/SurveyDialogContext";

export default function CTABanner() {
  const { openSurvey } = useSurveyDialog();
  return (
    <section id="counselling" className="py-24 bg-[#1A1B1E] text-white relative overflow-hidden">
      <div className="absolute inset-0 grain-overlay opacity-30" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#C5A059]/10 blur-3xl" />
      <div className="max-w-6xl mx-auto px-6 lg:px-10 relative">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Free · No obligation
            </p>
            <h2 className="font-serif-display text-5xl sm:text-6xl leading-[1.02] tracking-tight">
              Start your UAE <span className="italic text-[#C5A059]">business journey</span><br/>with a free counselling call.
            </h2>
            <p className="mt-6 text-white/70 max-w-2xl leading-relaxed">
              Answer five short questions — a senior consultant will call you within one business day with a personalised plan for your visa, career or company setup.
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <div className="w-full max-w-xs space-y-3">
              <Button
                onClick={openSurvey}
                className="w-full bg-[#C5A059] hover:bg-[#b18d47] text-white rounded-none h-14 text-base"
                data-testid="cta-open-consultation"
              >Get Free Consultation <ArrowRight className="w-4 h-4 ml-2" /></Button>
              <Button
                onClick={openSurvey}
                variant="outline"
                className="w-full border-white/30 bg-transparent text-white hover:bg-white hover:text-[#1A1B1E] rounded-none h-14 text-base"
                data-testid="cta-open-expert"
              >Talk to an Expert</Button>
              <div className="pt-4 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="font-serif-display text-2xl text-[#C5A059]">1000+</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/50">Drivers</p>
                </div>
                <div>
                  <p className="font-serif-display text-2xl text-[#C5A059]">7yrs</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/50">Experience</p>
                </div>
                <div>
                  <p className="font-serif-display text-2xl text-[#C5A059]">2027</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/50">License</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
