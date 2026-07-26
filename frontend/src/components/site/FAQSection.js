import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

const faqs = [
  { q: "How can I start a business in the UAE?", a: "Our consultants help you choose the right business structure, obtain approvals, and complete the registration process — mainland, free zone, or offshore." },
  { q: "Which trade license is right for me?", a: "We recommend the most suitable mainland or free zone license based on your business activity, ownership preferences, and long-term goals." },
  { q: "Can you help with talent acquisition and manpower recruitment?", a: "Yes. We provide end-to-end Indian talent acquisition and manpower recruitment for UAE businesses across taxi, hospitality, retail, corporate and skilled trades." },
  { q: "Do you provide corporate tax services?", a: "Yes — corporate tax registration, VAT support, filings and compliance documentation are handled end-to-end." },
  { q: "What are type-in services?", a: "Government-approved documentation and typing services for applications, renewals, amendments and legal paperwork — completed accurately and quickly." },
  { q: "Where is your head office?", a: "Compass Co-Working, Al Jazeera Al Hamra Industry, Ras Al Khaimah, UAE. We serve clients across the UAE and the wider GCC region." },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] mb-4 text-center">FAQ</p>
        <h2 className="font-serif-display text-4xl sm:text-5xl text-center leading-[1.05] tracking-tight">
          Questions we <span className="italic text-[#C5A059]">hear often.</span>
        </h2>
        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-b hairline" data-testid={`faq-${i}`}>
              <AccordionTrigger className="font-serif-display text-xl text-left py-6 hover:text-[#C5A059]">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
