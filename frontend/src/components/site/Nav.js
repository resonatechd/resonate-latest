import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { useSurveyDialog } from "../../context/SurveyDialogContext";

const links = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#updates", label: "Updates" },
  { href: "#team", label: "Team" },
  { href: "#clients", label: "Clients" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { openSurvey } = useSurveyDialog();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-xl border-b hairline shadow-sm" : "bg-white/70 backdrop-blur-md"
      }`}
      data-testid="site-nav"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-baseline gap-1" data-testid="nav-logo">
          <span className="font-serif-display text-2xl tracking-tight">Resonate</span>
          <span className="font-serif-display italic text-2xl text-[#C5A059]"> Dubai LLC</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-foreground/80 hover:text-[#C5A059] transition-colors duration-200"
              data-testid={`nav-link-${l.label.toLowerCase()}`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="/admin/login"
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-[#C5A059] px-3 py-2 transition-colors duration-200"
            data-testid="nav-admin-link"
          >
            Admin
          </a>
          <Button
            onClick={openSurvey}
            className="bg-[#C5A059] hover:bg-[#b18d47] text-white rounded-none h-10 px-5"
            data-testid="nav-cta-consultation"
          >Free Consultation →</Button>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          data-testid="nav-mobile-toggle"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t hairline px-6 py-4 space-y-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm text-foreground/80"
              data-testid={`nav-mobile-${l.label.toLowerCase()}`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/admin/login"
            onClick={() => setOpen(false)}
            className="block py-2 text-sm font-medium text-[#C5A059]"
            data-testid="nav-mobile-admin"
          >
            Admin Portal →
          </a>
          <Button onClick={() => { setOpen(false); openSurvey(); }} className="w-full bg-[#C5A059] hover:bg-[#b18d47] text-white rounded-none">
            Free Consultation
          </Button>
        </div>
      )}
    </header>
  );
}
