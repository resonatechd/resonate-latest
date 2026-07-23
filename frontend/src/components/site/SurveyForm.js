import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Progress } from "../ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck } from "lucide-react";
import api, { formatApiError } from "../../lib/api";
import { toast } from "sonner";

const TOTAL = 5;

const initial = {
  location: "",
  intent: "",
  visa_status: "",
  education: "",
  field_or_type: "",
  budget: "",
  timeline: "",
  experience_years: "",
  name: "",
  email: "",
  phone: "",
  nationality: "",
  notes: "",
};

export default function SurveyForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initial);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const canNext = () => {
    if (step === 0) return !!data.location;
    if (step === 1) return !!data.intent;
    if (step === 2) return !!data.education && !!data.budget;
    if (step === 3) return !!data.field_or_type;
    if (step === 4) return !!data.name && !!data.email && !!data.phone;
    return false;
  };

  const submit = async () => {
    setLoading(true);
    try {
      await api.post("/survey/submit", data);
      setSubmitted(true);
      toast.success("Thank you — our team will contact you within one business day.");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const progress = ((step + 1) / TOTAL) * 100;

  return (
    <section id="counselling" className="py-24 bg-[#1A1B1E] text-white relative overflow-hidden">
      <div className="absolute inset-0 grain-overlay opacity-30" />
      <div className="max-w-6xl mx-auto px-6 lg:px-10 relative">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] mb-4 flex items-center gap-2">
              <ClipboardCheck className="w-3.5 h-3.5" /> Free Counselling
            </p>
            <h2 className="font-serif-display text-4xl sm:text-5xl leading-[1.05] tracking-tight">
              Start your UAE <span className="italic text-[#C5A059]">business journey</span> today.
            </h2>
            <p className="mt-6 text-white/70 leading-relaxed max-w-md">
              Instead of a generic contact form, we ask a few short questions so our consultants can prepare a tailored plan before we speak with you.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-white/80 max-w-md">
              {["No obligation", "Response within 1 business day", "Handled by senior consultants"].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059]" /> {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-[#FDFBF7] text-[#1A1B1E] p-8 sm:p-10" data-testid="survey-card">
              {submitted ? (
                <div className="text-center py-10">
                  <CheckCircle2 className="w-14 h-14 text-[#C5A059] mx-auto" />
                  <h3 className="font-serif-display text-3xl mt-4">You're all set.</h3>
                  <p className="mt-3 text-muted-foreground max-w-md mx-auto">
                    Thank you, {data.name}. A senior consultant will contact you on {data.phone} within one business day.
                  </p>
                  <Button
                    onClick={() => { setSubmitted(false); setStep(0); setData(initial); }}
                    variant="outline" className="mt-8 rounded-none"
                    data-testid="survey-restart"
                  >Submit another enquiry</Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059]">Step {step + 1} of {TOTAL}</p>
                    <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
                  </div>
                  <Progress value={progress} className="h-1 mb-8 bg-accent [&>div]:bg-[#C5A059]" />

                  {step === 0 && (
                    <div data-testid="step-location">
                      <h3 className="font-serif-display text-3xl mb-2">Where are you right now?</h3>
                      <p className="text-sm text-muted-foreground mb-6">Helps us understand your visa & travel context.</p>
                      <RadioGroup value={data.location} onValueChange={(v) => set("location", v)} className="grid sm:grid-cols-2 gap-3">
                        {[
                          ["inside_uae", "I'm inside the UAE"],
                          ["outside_uae", "I'm outside the UAE"],
                        ].map(([val, label]) => (
                          <label key={val} className={`border cursor-pointer p-4 flex items-center gap-3 transition-colors ${data.location === val ? "border-[#C5A059] bg-accent/60" : "hairline"}`}>
                            <RadioGroupItem value={val} data-testid={`opt-loc-${val}`} />
                            <span className="text-sm font-medium">{label}</span>
                          </label>
                        ))}
                      </RadioGroup>
                      {data.location === "inside_uae" && (
                        <div className="mt-6">
                          <Label>Current visa status</Label>
                          <Select value={data.visa_status} onValueChange={(v) => set("visa_status", v)}>
                            <SelectTrigger data-testid="opt-visa-status" className="mt-2"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="visit">Visit visa</SelectItem>
                              <SelectItem value="employment">Employment visa</SelectItem>
                              <SelectItem value="investor">Investor visa</SelectItem>
                              <SelectItem value="family">Family visa</SelectItem>
                              <SelectItem value="cancelled">Recently cancelled</SelectItem>
                              <SelectItem value="none">No visa yet</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  )}

                  {step === 1 && (
                    <div data-testid="step-intent">
                      <h3 className="font-serif-display text-3xl mb-2">What brings you to the UAE?</h3>
                      <p className="text-sm text-muted-foreground mb-6">Choose the option that best describes your goal.</p>
                      <RadioGroup value={data.intent} onValueChange={(v) => set("intent", v)} className="grid sm:grid-cols-2 gap-3">
                        {[
                          ["business", "I want to open a business / trade license"],
                          ["job", "I'm looking for a job"],
                          ["visit", "I'm coming on a visit basis"],
                          ["taxi", "Sharjah taxi driver visa"],
                          ["family", "Family visa / dependent"],
                          ["other", "Other / not sure yet"],
                        ].map(([val, label]) => (
                          <label key={val} className={`border cursor-pointer p-4 flex items-center gap-3 transition-colors ${data.intent === val ? "border-[#C5A059] bg-accent/60" : "hairline"}`}>
                            <RadioGroupItem value={val} data-testid={`opt-intent-${val}`} />
                            <span className="text-sm font-medium">{label}</span>
                          </label>
                        ))}
                      </RadioGroup>
                    </div>
                  )}

                  {step === 2 && (
                    <div data-testid="step-education-budget">
                      <h3 className="font-serif-display text-3xl mb-2">Your background</h3>
                      <p className="text-sm text-muted-foreground mb-6">A few basics so we recommend the right path.</p>
                      <div className="space-y-5">
                        <div>
                          <Label>Highest education</Label>
                          <Select value={data.education} onValueChange={(v) => set("education", v)}>
                            <SelectTrigger data-testid="opt-education" className="mt-2"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="school">School</SelectItem>
                              <SelectItem value="diploma">Diploma / ITI</SelectItem>
                              <SelectItem value="bachelor">Bachelor's</SelectItem>
                              <SelectItem value="master">Master's or higher</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Approximate budget (AED)</Label>
                          <Select value={data.budget} onValueChange={(v) => set("budget", v)}>
                            <SelectTrigger data-testid="opt-budget" className="mt-2"><SelectValue placeholder="Select range" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lt-10k">Less than 10,000 AED</SelectItem>
                              <SelectItem value="10-25k">10,000 – 25,000 AED</SelectItem>
                              <SelectItem value="25-50k">25,000 – 50,000 AED</SelectItem>
                              <SelectItem value="50-100k">50,000 – 100,000 AED</SelectItem>
                              <SelectItem value="gt-100k">More than 100,000 AED</SelectItem>
                              <SelectItem value="not-sure">Not sure yet</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Years of work experience</Label>
                          <Input value={data.experience_years} onChange={(e) => set("experience_years", e.target.value)} placeholder="e.g. 5" data-testid="opt-experience" />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div data-testid="step-type">
                      <h3 className="font-serif-display text-3xl mb-2">Tell us more</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        {data.intent === "business" ? "What kind of business are you planning?" :
                         data.intent === "job" ? "What type of job or industry are you looking for?" :
                         "Describe what you're planning in the UAE."}
                      </p>
                      <div className="space-y-5">
                        <div>
                          <Label>Business type / job field</Label>
                          <Input value={data.field_or_type} onChange={(e) => set("field_or_type", e.target.value)}
                            placeholder="e.g. General trading, IT services, Retail sales…" data-testid="opt-field" />
                        </div>
                        <div>
                          <Label>Timeline to start</Label>
                          <Select value={data.timeline} onValueChange={(v) => set("timeline", v)}>
                            <SelectTrigger data-testid="opt-timeline" className="mt-2"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="asap">As soon as possible</SelectItem>
                              <SelectItem value="1-month">Within 1 month</SelectItem>
                              <SelectItem value="3-month">Within 3 months</SelectItem>
                              <SelectItem value="6-month">Within 6 months</SelectItem>
                              <SelectItem value="exploring">Just exploring</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Anything else we should know? <span className="text-muted-foreground">(optional)</span></Label>
                          <Textarea rows={3} value={data.notes} onChange={(e) => set("notes", e.target.value)} data-testid="opt-notes" />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div data-testid="step-contact">
                      <h3 className="font-serif-display text-3xl mb-2">Where should we reach you?</h3>
                      <p className="text-sm text-muted-foreground mb-6">A senior consultant will call you within one business day.</p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Full name</Label>
                          <Input value={data.name} onChange={(e) => set("name", e.target.value)} required data-testid="opt-name" />
                        </div>
                        <div>
                          <Label>Nationality</Label>
                          <Input value={data.nationality} onChange={(e) => set("nationality", e.target.value)} data-testid="opt-nationality" />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} required data-testid="opt-email" />
                        </div>
                        <div>
                          <Label>Phone (with country code)</Label>
                          <Input value={data.phone} onChange={(e) => set("phone", e.target.value)} required placeholder="+971 …" data-testid="opt-phone" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-10 flex items-center justify-between">
                    <Button
                      variant="outline" onClick={() => setStep(Math.max(0, step - 1))}
                      disabled={step === 0} className="rounded-none"
                      data-testid="survey-back"
                    ><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                    {step < TOTAL - 1 ? (
                      <Button
                        onClick={() => canNext() && setStep(step + 1)}
                        disabled={!canNext()}
                        className="bg-[#C5A059] hover:bg-[#b18d47] text-white rounded-none px-6"
                        data-testid="survey-next"
                      >Continue <ArrowRight className="w-4 h-4 ml-2" /></Button>
                    ) : (
                      <Button
                        onClick={submit}
                        disabled={!canNext() || loading}
                        className="bg-[#C5A059] hover:bg-[#b18d47] text-white rounded-none px-6"
                        data-testid="survey-submit"
                      >{loading ? "Submitting…" : "Submit enquiry"}</Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
