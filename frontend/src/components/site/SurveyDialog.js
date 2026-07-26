import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Progress } from "../ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../ui/select";
import { Dialog, DialogContent } from "../ui/dialog";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck, Upload, X } from "lucide-react";
import api, { formatApiError } from "../../lib/api";
import { toast } from "sonner";
import { useSurveyDialog } from "../../context/SurveyDialogContext";

const TOTAL = 5;

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman & Nicobar Islands","Chandigarh","Dadra & Nagar Haveli and Daman & Diu",
  "Delhi","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry",
];

const INDUSTRIES = [
  "Tourism & Hospitality","Restaurant / Kitchen","Waitering / Front-of-house","Housekeeping",
  "Taxi Driver","Bike Rider (Delivery)","Truck Driver","Warehouse & Logistics",
  "Retail Sales","Real Estate Sales","Marketing / Digital Marketing","Website / App Development",
  "Accountant / Finance","Admin / Office Support","Customer Service","Human Resources",
  "Mechanical Engineering","Civil Engineering","Electrical Engineering","IT Support / Networking",
  "Manufacturing / Factory","Construction","Cleaning Services","Security","Healthcare / Nursing",
  "Beauty / Salon","Automotive Repair","Teaching / Training","Media / Content","Other",
];

const EDU_DETAIL = {
  "10th": ["General 10th pass"],
  "12th": ["Science","Commerce","Arts","Diploma / ITI"],
  Graduation: ["BA","B.Com","BSc","BBA","B.Tech / Engineering","BCA","Other Bachelor's"],
  "Post-Graduation": ["MA","M.Com","MSc","MBA","M.Tech","MCA","Other Master's","PhD"],
};

const initial = {
  name: "", age: "", phone: "", email: "",
  state: "",
  has_passport: "", passport_front_path: "", passport_back_path: "",
  intent: "",
  education: "", education_detail: "", has_experience: "", industry: "", vacancy: "",
  notes: "",
};

export default function SurveyDialog() {
  const { open, setOpen, closeSurvey } = useSurveyDialog();
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initial);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vacancies, setVacancies] = useState([]);
  const [uploadingKey, setUploadingKey] = useState(null);

  useEffect(() => {
    if (open) {
      api.get("/vacancies").then((r) => setVacancies(r.data || [])).catch(() => {});
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      // reset a moment after close so animation doesn't flash empty
      const t = setTimeout(() => { setStep(0); setData(initial); setSubmitted(false); }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const uploadPassport = async (side, file) => {
    if (!file) return;
    setUploadingKey(side);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data: resp } = await api.post("/survey/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set(side === "front" ? "passport_front_path" : "passport_back_path", resp.path);
      toast.success(`Passport ${side} uploaded`);
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setUploadingKey(null);
    }
  };

  const canNext = () => {
    if (step === 0) return !!data.name && !!data.age && !!data.phone;
    if (step === 1) return !!data.state;
    if (step === 2) return !!data.has_passport;
    if (step === 3) return !!data.intent;
    if (step === 4) return !!data.education && !!data.has_experience;
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="p-0 gap-0 max-w-5xl w-[calc(100vw-2rem)] max-h-[92vh] overflow-hidden rounded-none border-0 shadow-2xl"
        data-testid="survey-dialog"
      >
        <div className="grid md:grid-cols-12 max-h-[92vh]">
          {/* Left brand panel */}
          <aside className="hidden md:flex md:col-span-4 bg-[#1A1B1E] text-white p-10 flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 grain-overlay opacity-30" />
            <div className="relative">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] flex items-center gap-2 mb-6">
                <ClipboardCheck className="w-3.5 h-3.5" /> Free Counselling
              </p>
              <h2 className="font-serif-display text-4xl leading-[1.05] tracking-tight">
                Start your UAE <span className="italic text-[#C5A059]">journey.</span>
              </h2>
              <p className="mt-6 text-sm text-white/70 leading-relaxed">
                A few short questions help our consultants prepare a tailored plan — visa, a job in the UAE, or a company setup — before we speak with you.
              </p>
            </div>
            <ul className="relative space-y-3 text-sm text-white/80">
              {["No obligation, no cost","Response within one business day","Handled by senior consultants"].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059]">Head Office</p>
              <p className="font-serif-display text-lg leading-tight mt-2">
                Compass Co-Working, Al Jazeera<br/>Al Hamra Industry · RAK, UAE
              </p>
            </div>
          </aside>

          {/* Right form panel */}
          <div className="md:col-span-8 bg-[#FDFBF7] text-[#1A1B1E] p-6 sm:p-10 overflow-y-auto relative">
            <button
              onClick={closeSurvey}
              aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center hover:bg-accent transition-colors"
              data-testid="survey-close"
            ><X className="w-5 h-5" /></button>

            {submitted ? (
              <div className="text-center py-14">
                <CheckCircle2 className="w-16 h-16 text-[#C5A059] mx-auto" />
                <h3 className="font-serif-display text-3xl mt-5">You're all set.</h3>
                <p className="mt-3 text-muted-foreground max-w-md mx-auto">
                  Thank you, {data.name}. A senior consultant will contact you on {data.phone} within one business day.
                </p>
                <div className="mt-8 flex justify-center gap-3">
                  <Button
                    onClick={() => { setSubmitted(false); setStep(0); setData(initial); }}
                    variant="outline" className="rounded-none"
                    data-testid="survey-restart"
                  >Submit another enquiry</Button>
                  <Button onClick={closeSurvey} className="bg-[#C5A059] hover:bg-[#b18d47] text-white rounded-none">
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2 pr-10">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059]">Step {step + 1} of {TOTAL}</p>
                  <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
                </div>
                <Progress value={progress} className="h-1 mb-8 bg-accent [&>div]:bg-[#C5A059]" />

                {step === 0 && (
                  <div data-testid="step-basics">
                    <h3 className="font-serif-display text-3xl mb-2">Tell us about yourself</h3>
                    <p className="text-sm text-muted-foreground mb-6">Your name, age and a phone number we can reach you on.</p>
                    <div className="space-y-4">
                      <div>
                        <Label>Full name</Label>
                        <Input value={data.name} onChange={(e) => set("name", e.target.value)} required data-testid="opt-name" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Age</Label>
                          <Select value={data.age} onValueChange={(v) => set("age", v)}>
                            <SelectTrigger data-testid="opt-age" className="mt-2"><SelectValue placeholder="Scroll to pick" /></SelectTrigger>
                            <SelectContent className="max-h-72">
                              {Array.from({ length: 32 }, (_, i) => i + 18).map((n) => (
                                <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Phone (with country code)</Label>
                          <Input value={data.phone} onChange={(e) => set("phone", e.target.value)} required placeholder="+91 …" data-testid="opt-phone" />
                        </div>
                      </div>
                      <div>
                        <Label>Email <span className="text-muted-foreground">(optional)</span></Label>
                        <Input type="email" value={data.email} onChange={(e) => set("email", e.target.value)} data-testid="opt-email" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div data-testid="step-state">
                    <h3 className="font-serif-display text-3xl mb-2">Which state are you from?</h3>
                    <p className="text-sm text-muted-foreground mb-6">Helps us route you to the right regional consultant.</p>
                    <Label>State</Label>
                    <Select value={data.state} onValueChange={(v) => set("state", v)}>
                      <SelectTrigger data-testid="opt-state" className="mt-2"><SelectValue placeholder="Scroll to select your state" /></SelectTrigger>
                      <SelectContent className="max-h-80">
                        {INDIAN_STATES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                        <SelectItem value="Outside India">Outside India</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {step === 2 && (
                  <div data-testid="step-passport">
                    <h3 className="font-serif-display text-3xl mb-2">Do you have a valid passport?</h3>
                    <p className="text-sm text-muted-foreground mb-6">If yes, please upload the front and back for our records.</p>
                    <RadioGroup value={data.has_passport} onValueChange={(v) => set("has_passport", v)} className="grid sm:grid-cols-2 gap-3">
                      {[["yes","Yes, I have a valid passport"], ["no","No, not yet"]].map(([val, label]) => (
                        <label key={val} className={`border cursor-pointer p-4 flex items-center gap-3 transition-colors ${data.has_passport === val ? "border-[#C5A059] bg-accent/60" : "hairline"}`}>
                          <RadioGroupItem value={val} data-testid={`opt-pp-${val}`} />
                          <span className="text-sm font-medium">{label}</span>
                        </label>
                      ))}
                    </RadioGroup>

                    {data.has_passport === "yes" && (
                      <div className="mt-6 grid sm:grid-cols-2 gap-4">
                        {[
                          { side: "front", label: "Passport front", path: data.passport_front_path },
                          { side: "back", label: "Passport back", path: data.passport_back_path },
                        ].map((p) => (
                          <div key={p.side}>
                            <Label>{p.label}</Label>
                            <label className="mt-2 flex items-center gap-3 border hairline px-3 py-3 cursor-pointer hover:border-[#C5A059] transition-colors" data-testid={`opt-pp-file-${p.side}`}>
                              <Upload className="w-4 h-4 text-[#C5A059]" />
                              <span className="text-xs flex-1 truncate">
                                {uploadingKey === p.side ? "Uploading…" : p.path ? "Uploaded ✓" : "Choose image or PDF"}
                              </span>
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                className="hidden"
                                onChange={(e) => uploadPassport(p.side, e.target.files?.[0])}
                              />
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div data-testid="step-intent">
                    <h3 className="font-serif-display text-3xl mb-2">What are you planning?</h3>
                    <p className="text-sm text-muted-foreground mb-6">Pick the option that best describes your goal.</p>
                    <RadioGroup value={data.intent} onValueChange={(v) => set("intent", v)} className="grid gap-3">
                      {[
                        ["visit","Visit the UAE (tourism)"],
                        ["business","Open a company in the UAE"],
                        ["job","Looking for a job in the UAE"],
                      ].map(([val, label]) => (
                        <label key={val} className={`border cursor-pointer p-4 flex items-center gap-3 transition-colors ${data.intent === val ? "border-[#C5A059] bg-accent/60" : "hairline"}`}>
                          <RadioGroupItem value={val} data-testid={`opt-intent-${val}`} />
                          <span className="text-sm font-medium">{label}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {step === 4 && (
                  <div data-testid="step-work">
                    <h3 className="font-serif-display text-3xl mb-2">Your background</h3>
                    <p className="text-sm text-muted-foreground mb-6">A few details help us match you to the right opportunity.</p>
                    <div className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Last education</Label>
                          <Select value={data.education} onValueChange={(v) => { set("education", v); set("education_detail", ""); }}>
                            <SelectTrigger data-testid="opt-education" className="mt-2"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10th">10th</SelectItem>
                              <SelectItem value="12th">12th</SelectItem>
                              <SelectItem value="Graduation">Graduation</SelectItem>
                              <SelectItem value="Post-Graduation">Post-Graduation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {data.education && (
                          <div>
                            <Label>Field / stream</Label>
                            <Select value={data.education_detail} onValueChange={(v) => set("education_detail", v)}>
                              <SelectTrigger data-testid="opt-edu-detail" className="mt-2"><SelectValue placeholder="Select" /></SelectTrigger>
                              <SelectContent>
                                {(EDU_DETAIL[data.education] || []).map((d) => (
                                  <SelectItem key={d} value={d}>{d}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                      <div>
                        <Label>Do you have any working experience?</Label>
                        <RadioGroup value={data.has_experience} onValueChange={(v) => set("has_experience", v)} className="mt-2 grid grid-cols-2 gap-3">
                          {[["yes","Yes"],["no","No"]].map(([val,label]) => (
                            <label key={val} className={`border cursor-pointer p-3 flex items-center gap-3 transition-colors ${data.has_experience === val ? "border-[#C5A059] bg-accent/60" : "hairline"}`}>
                              <RadioGroupItem value={val} data-testid={`opt-exp-${val}`} />
                              <span className="text-sm font-medium">{label}</span>
                            </label>
                          ))}
                        </RadioGroup>
                      </div>

                      {data.has_experience === "yes" && (
                        <div>
                          <Label>Which industry?</Label>
                          <Select value={data.industry} onValueChange={(v) => set("industry", v)}>
                            <SelectTrigger data-testid="opt-industry" className="mt-2"><SelectValue placeholder="Select industry" /></SelectTrigger>
                            <SelectContent className="max-h-72">
                              {INDUSTRIES.map((i) => (<SelectItem key={i} value={i}>{i}</SelectItem>))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {data.intent === "job" && (
                        <div>
                          <Label>Which vacancy interests you?</Label>
                          <Select value={data.vacancy} onValueChange={(v) => set("vacancy", v)}>
                            <SelectTrigger data-testid="opt-vacancy" className="mt-2"><SelectValue placeholder="Select open vacancy" /></SelectTrigger>
                            <SelectContent className="max-h-72">
                              {vacancies.map((v) => (
                                <SelectItem key={v.id} value={v.title}>{v.title}</SelectItem>
                              ))}
                              <SelectItem value="Other / not listed">Other / not listed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div>
                        <Label>Anything else we should know? <span className="text-muted-foreground">(optional)</span></Label>
                        <Textarea rows={3} value={data.notes} onChange={(e) => set("notes", e.target.value)} data-testid="opt-notes" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between">
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
      </DialogContent>
    </Dialog>
  );
}
