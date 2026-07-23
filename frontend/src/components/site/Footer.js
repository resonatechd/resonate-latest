import { MapPin, Mail, Phone } from "lucide-react";

const services = [
  "Business Setup", "Trade License", "Visa Services", "Sharjah Taxi Visa",
  "Corporate Tax", "PRO Services", "Manpower Solutions", "Digital Marketing",
];

const company = ["About Us", "Our Services", "FAQs", "Counselling"];

export default function Footer() {
  return (
    <footer className="bg-[#1A1B1E] text-white pt-20 pb-8 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <a href="#top" className="flex items-baseline gap-1">
            <span className="font-serif-display text-3xl">Resonate</span>
            <span className="font-serif-display italic text-3xl text-[#C5A059]">.Dubai</span>
          </a>
          <p className="mt-6 text-white/70 max-w-md text-sm leading-relaxed">
            UAE-registered business consultancy delivering trade license, visa, corporate tax and manpower solutions across the Emirates. Trade license valid until March 2027.
          </p>
          <div className="mt-8 space-y-3 text-sm">
            <p className="flex items-start gap-3"><MapPin className="w-4 h-4 text-[#C5A059] mt-0.5" /> Compass Co-Working, Al Hamra,<br />Ras Al Khaimah, UAE</p>
            <p className="flex items-center gap-3"><Mail className="w-4 h-4 text-[#C5A059]" /> hello@resonate.dubai</p>
            <p className="flex items-center gap-3"><Phone className="w-4 h-4 text-[#C5A059]" /> +971 00 000 0000</p>
          </div>
        </div>

        <div className="md:col-span-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] mb-5">Services</p>
          <ul className="grid grid-cols-2 gap-y-2 text-sm">
            {services.map((s) => (
              <li key={s}><a href="#services" className="text-white/80 hover:text-[#C5A059] transition-colors">{s}</a></li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] mb-5">Company</p>
          <ul className="space-y-2 text-sm">
            {company.map((s) => (
              <li key={s}><a href="#about" className="text-white/80 hover:text-[#C5A059] transition-colors">{s}</a></li>
            ))}
            <li><a href="/admin/login" className="text-white/50 hover:text-[#C5A059] transition-colors" data-testid="footer-admin-link">Admin</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-16 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-white/50">
        <p>© {new Date().getFullYear()} Resonate.Dubai LLC · Trade license valid until March 2027.</p>
        <p>Serving the UAE · Pan-Asia reach</p>
      </div>
    </footer>
  );
}
