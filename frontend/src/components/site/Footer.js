import { MapPin, Mail, Phone, Building2 } from "lucide-react";

const services = [
  "UAE Trade License Services",
  "Project Management & Legal Documentation",
  "Corporate Tax & Talent Acquisition",
  "Taxi Visa & Golden Visa Updates",
  "Manpower Recruitment",
  "Digital Marketing & Meta Tools",
];

const company = ["About Us", "Our Services", "Team", "FAQs", "Counselling"];

const EMAILS = [
  { label: "B2B Partnership & Quotations", value: "hr.resonateuae@gmail.com" },
  { label: "Enquiry & Appointment", value: "resonate.chd@gmail.com" },
];

const NUMBERS = [
  { label: "Official", value: "+971 52 693 9382" },
  { label: "Head of Operations", value: "+971 55 479 2499" },
  { label: "India Office", value: "+91 62801 46896" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1A1B1E] text-white pt-20 pb-8 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <a href="#top" className="flex items-baseline gap-1">
            <span className="font-serif-display text-3xl">Resonate</span>
            <span className="font-serif-display italic text-3xl text-[#C5A059]"> Dubai LLC</span>
          </a>
          <p className="mt-6 text-white/70 max-w-md text-sm leading-relaxed">
            UAE-registered project management, talent acquisition and manpower recruitment consultancy delivering trusted business solutions across the GCC. Trade license valid until March 2027.
          </p>
          <div className="mt-8 space-y-3 text-sm">
            <p className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#C5A059] mt-0.5" />
              Compass Co-Working Space,<br />
              Al Jazeera Al Hamra Industry,<br />
              Ras Al Khaimah, United Arab Emirates
            </p>
          </div>
        </div>

        <div className="md:col-span-4 space-y-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] mb-4 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Email
            </p>
            <ul className="space-y-3 text-sm">
              {EMAILS.map((e) => (
                <li key={e.value}>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">{e.label}</p>
                  <a
                    href={`mailto:${e.value}`}
                    className="text-white/90 hover:text-[#C5A059] transition-colors font-medium"
                    data-testid={`footer-email-${e.value.split("@")[0]}`}
                  >{e.value}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] mb-4 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" /> Phone
            </p>
            <ul className="space-y-3 text-sm">
              {NUMBERS.map((n) => (
                <li key={n.value}>
                  <p className="text-[10px] uppercase tracking-widest text-white/40">{n.label}</p>
                  <a
                    href={`tel:${n.value.replace(/\s/g, "")}`}
                    className="text-white/90 hover:text-[#C5A059] transition-colors font-medium"
                    data-testid={`footer-phone-${n.value.replace(/\s/g, "")}`}
                  >{n.value}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] mb-5 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5" /> Services
          </p>
          <ul className="space-y-2 text-sm">
            {services.map((s) => (
              <li key={s}><a href="#services" className="text-white/80 hover:text-[#C5A059] transition-colors">{s}</a></li>
            ))}
          </ul>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] mb-4 mt-8">Company</p>
          <ul className="space-y-2 text-sm">
            {company.map((s) => (
              <li key={s}><a href="#about" className="text-white/80 hover:text-[#C5A059] transition-colors">{s}</a></li>
            ))}
            <li><a href="/admin/login" className="text-white/50 hover:text-[#C5A059] transition-colors" data-testid="footer-admin-link">Admin</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-16 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-white/50">
        <p>© {new Date().getFullYear()} Resonate Dubai LLC · Trade license valid until March 2027.</p>
        <p>Serving the UAE · GCC reach</p>
      </div>
    </footer>
  );
}
