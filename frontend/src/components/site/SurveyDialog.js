import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../ui/select";
import { Dialog, DialogContent } from "../ui/dialog";
import { CheckCircle2, ClipboardCheck, ArrowRight } from "lucide-react";
import api, { formatApiError } from "../../lib/api";
import { toast } from "sonner";
import { useSurveyDialog } from "../../context/SurveyDialogContext";

export default function SurveyDialog() {
  const { open, setOpen, closeSurvey } = useSurveyDialog();
  const [questions, setQuestions] = useState([]);
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
        setAnswers({}); setSubmitted(false);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  const setAns = (id, v) => setAnswers((a) => ({ ...a, [id]: v }));

  const canSubmit = () => {
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="p-0 gap-0 max-w-4xl w-[calc(100vw-2rem)] max-h-[92vh] overflow-hidden rounded-none border-0 shadow-2xl"
        data-testid="survey-dialog"
      >
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

          <div className="md:col-span-8 bg-[#FDFBF7] text-[#1A1B1E] p-6 sm:p-10 overflow-y-auto">
            {submitted ? (
              <div className="text-center py-14">
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
                <p className="text-[11px] uppercase tracking-[0.25em] text-[#C5A059]">Contact & counselling</p>
                <h3 className="font-serif-display text-3xl mt-2 mb-6">Tell us about you</h3>

                <div className="space-y-5">
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

                  {questions.length > 0 && <div className="pt-4 border-t hairline"></div>}

                  {questions.map((q) => (
                    <div key={q.id}>
                      <Label htmlFor={q.id}>
                        {q.label}
                        {q.required && <span className="text-destructive"> *</span>}
                      </Label>
                      {q.help_text && <p className="text-xs text-muted-foreground mt-1">{q.help_text}</p>}
                      {renderField(q)}
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-end gap-3">
                  <Button variant="outline" onClick={closeSurvey} className="rounded-none" data-testid="survey-cancel">Cancel</Button>
                  <Button
                    onClick={submit}
                    disabled={!canSubmit() || loading}
                    className="bg-[#C5A059] hover:bg-[#b18d47] text-white rounded-none px-6"
                    data-testid="survey-submit"
                  >{loading ? "Submitting…" : "Submit enquiry"} <ArrowRight className="w-4 h-4 ml-2" /></Button>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
