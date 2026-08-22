import { useEffect, useState, useMemo } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Progress } from "../ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../ui/select";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { CheckCircle2, ClipboardCheck, ArrowLeft, ArrowRight } from "lucide-react";
import api, { formatApiError } from "../../lib/api";
import { toast } from "sonner";
import { useSurveyDialog } from "../../context/SurveyDialogContext";

export default function SurveyDialog() {
  const { open, setOpen, closeSurvey } = useSurveyDialog();
  const [questions, setQuestions] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [answers, setAnswers] = useState({}); // {question_id: value}
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      api.get("/questions").then((r) => setQuestions(r.data || [])).catch(() => {});
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setName(""); setPhone(""); setEmail("");
        setAnswers({}); setSubmitted(false); setActiveStep(0);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  const stepNumbers = useMemo(() => {
    const set = new Set(questions.map((q) => q.step || 1));
    const arr = Array.from(set).sort((a, b) => a - b);
    return arr.length > 0 ? arr : [1];
  }, [questions]);

  const totalSteps = 1 + stepNumbers.length;

  const setAns = (id, v) => setAnswers((a) => ({ ...a, [id]: v }));

  const currentQuestions = useMemo(() => {
    if (activeStep === 0) return [];
    const targetStep = stepNumbers[activeStep - 1];
    return questions.filter((q) => (q.step || 1) === targetStep);
  }, [activeStep, stepNumbers, questions]);

  const canNext = () => {
    if (activeStep === 0) return !!name.trim() && !!phone.trim();
    for (const q of currentQuestions) {
      if (q.required && !answers[q.id]) return false;
    }
    return true;
  };

  const canSubmitAll = () => {
    if (!name.trim() || !phone.trim()) return false;
    for (const q of questions) {
      if (q.required && !answers[q.id]) return false;
    }
    return true;
  };

  const submit = async () => {
    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        answers: questions.map((q) => ({
          question_id: q.id,
          label: q.label,
          type: q.type,
          value: answers[q.id] || "",
        })),
      };
      await api.post("/survey/submit", payload);
      setSubmitted(true);
      toast.success("Thank you — our team will contact you within one business day.");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const renderField = (q) => {
    const val = answers[q.id] || "";
    if (q.type === "radio") {
      return (
        <RadioGroup value={val} onValueChange={(v) => setAns(q.id, v)} className="mt-2 grid gap-2.5">
          {(q.options || []).map((opt) => (
            <label key={opt} className={`border cursor-pointer p-3.5 flex items-center gap-3 transition-colors ${val === opt ? "border-[#C5A059] bg-accent/60" : "hairline"}`}>
              <RadioGroupItem value={opt} id={`q-${q.id}-${opt}`} data-testid={`question-radio-${q.id}-${opt}`} />
              <span className="text-sm font-medium">{opt}</span>
            </label>
          ))}
        </RadioGroup>
      );
    }
    if (q.type === "select") {
      return (
        <Select value={val} onValueChange={(v) => setAns(q.id, v)}>
          <SelectTrigger data-testid={`question-${q.id}`} className="mt-2"><SelectValue placeholder="Select an option" /></SelectTrigger>
          <SelectContent className="max-h-72">
            {(q.options || []).map((o) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
          </SelectContent>
        </Select>
      );
    }
    if (q.type === "textarea") {
      return <Textarea rows={3} value={val} onChange={(e) => setAns(q.id, e.target.value)} data-testid={`question-${q.id}`} className="mt-2" />;
    }
    return <Input value={val} onChange={(e) => setAns(q.id, e.target.value)} data-testid={`question-${q.id}`} className="mt-2" />;
  };

  const progress = ((activeStep + 1) / totalSteps) * 100;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="p-0 gap-0 max-w-4xl w-[calc(100vw-2rem)] max-h-[92vh] overflow-hidden rounded-none border-0 shadow-2xl"
        data-testid="survey-dialog"
      >
        <DialogTitle className="sr-only">Free Counselling — Resonate Dubai LLC</DialogTitle>
        <DialogDescription className="sr-only">
          Answer a few short questions so a senior consultant can prepare a tailored plan before contacting you.
        </DialogDescription>
        <div className="grid md:grid-cols-12 max-h-[92vh]">
          <aside className="hidden md:flex md:col-span-4 bg-[#1A1B1E] text-white p-8 flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 grain-overlay opacity-30" />
            <div className="relative">
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] flex items-center gap-2 mb-5">
                <ClipboardCheck className="w-3.5 h-3.5" /> Free Counselling
              </p>
              <h2 className="font-serif-display text-3xl leading-[1.05] tracking-tight">
                Start your UAE <span className="italic text-[#C5A059]">journey.</span>
              </h2>
              <p className="mt-5 text-sm text-white/70 leading-relaxed">
                A few short questions help our consultants prepare a tailored plan before we speak with you.
              </p>
            </div>
            <ul className="relative space-y-3 text-sm text-white/80">
              {["No obligation","Response within 1 business day","Senior consultants only"].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </aside>

          <div className="md:col-span-8 bg-[#FDFBF7] text-[#1A1B1E] p-6 sm:p-10 overflow-y-auto flex flex-col justify-between min-h-[500px]">
            {submitted ? (
              <div className="text-center py-14 my-auto">
                <CheckCircle2 className="w-16 h-16 text-[#C5A059] mx-auto" />
                <h3 className="font-serif-display text-3xl mt-5">You're all set.</h3>
                <p className="mt-3 text-muted-foreground max-w-md mx-auto">
                  Thank you, {name}. A senior consultant will contact you on {phone} within one business day.
                </p>
                <div className="mt-8 flex justify-center gap-3">
                  <Button onClick={closeSurvey} className="bg-[#C5A059] hover:bg-[#b18d47] text-white rounded-none">Close</Button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059]">Step {activeStep + 1} of {totalSteps}</p>
                    <p className="text-xs text-muted-foreground">{Math.round(progress)}%</p>
                  </div>
                  <Progress value={progress} className="h-1 mb-8 bg-accent [&>div]:bg-[#C5A059]" />

                  {activeStep === 0 ? (
                    <div>
                      <h3 className="font-serif-display text-3xl mb-2">Tell us about yourself</h3>
                      <p className="text-sm text-muted-foreground mb-6">Your name, phone number, and optional email to reach you.</p>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="s-name">Full name <span className="text-destructive">*</span></Label>
                          <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} required data-testid="survey-name" className="mt-2" />
                        </div>
                        <div>
                          <Label htmlFor="s-phone">Phone (with country code) <span className="text-destructive">*</span></Label>
                          <Input id="s-phone" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+91 …" data-testid="survey-phone" className="mt-2" />
                        </div>
                        <div>
                          <Label htmlFor="s-email">Email <span className="text-muted-foreground">(optional)</span></Label>
                          <Input id="s-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="survey-email" className="mt-2" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-serif-display text-3xl mb-2">Details — Step {stepNumbers[activeStep - 1]}</h3>
                      <p className="text-sm text-muted-foreground mb-6">Please answer the questions below to help us understand your requirements.</p>

                      <div className="space-y-6">
                        {currentQuestions.map((q) => (
                          <div key={q.id}>
                            <Label htmlFor={q.id}>
                              {q.label}
                              {q.required && <span className="text-destructive"> *</span>}
                            </Label>
                            {q.help_text && <p className="text-xs text-muted-foreground mt-1 mb-1">{q.help_text}</p>}
                            {renderField(q)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-10 flex items-center justify-between border-t hairline pt-6">
                  <Button
                    variant="outline"
                    onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                    disabled={activeStep === 0}
                    className="rounded-none"
                    data-testid="survey-back"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>

                  {activeStep < totalSteps - 1 ? (
                    <Button
                      onClick={() => canNext() && setActiveStep((s) => s + 1)}
                      disabled={!canNext()}
                      className="bg-[#C5A059] hover:bg-[#b18d47] text-white rounded-none px-6"
                      data-testid="survey-next"
                    >
                      Continue <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={submit}
                      disabled={!canSubmitAll() || loading}
                      className="bg-[#C5A059] hover:bg-[#b18d47] text-white rounded-none px-6"
                      data-testid="survey-submit"
                    >
                      {loading ? "Submitting…" : "Submit enquiry"}
                    </Button>
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
