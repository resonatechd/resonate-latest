import { useState } from "react";

function TeamPhoto({ name, src }) {
  const [errored, setErrored] = useState(false);
  const initials = name.split(" ").filter(Boolean).map((n) => n.charAt(0)).slice(0, 2).join("");
  return (
    <div className="aspect-[4/5] overflow-hidden bg-[#E8E2D2] relative">
      {!errored ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onError={() => setErrored(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center font-serif-display text-6xl italic text-[#C5A059]/70">
          {initials}
        </div>
      )}
    </div>
  );
}

const TEAM = [
  {
    name: "Mr. R. Khanna",
    role: "Founder & CEO",
    img: "/team/khanna.jpg",
    bio: "6+ years across recruitment, career counselling and talent acquisition — including two years in Canada where he trained as a certified IELTS trainer and served as a communications trainer at Dell (Toronto). Known for eloquent speaking and building interview confidence in young aspirants.",
  },
  {
    name: "Mrs. S R Sobti",
    role: "Managing Director",
    img: "/team/sobti.jpg",
    bio: "Associated with Resonate Dubai LLC and Mr. Khanna's previous venture HUMBÈR since 2020. Bachelor of Science background with close experience alongside NHS UK and Malaysian health departments during Covid. Handles administration, CRM and channel partner relationships across India and Malaysia.",
  },
  {
    name: "Yasmeen Abbasi",
    role: "Head of Operations",
    img: "/team/yasmeen.jpg",
    bio: "The backbone of Resonate. Hailing from Lahore with 25+ years of UAE experience. A high-spirited MBA graduate committed to client management, customer satisfaction and operational excellence — she brings strategic insight that drives consistent results.",
  },
  {
    name: "Mr. Abdul Rehman",
    role: "Transport Supervisor",
    img: "/team/rehman.jpg",
    bio: "An engineer by profession and a musical enthusiast. Hails from Pakistan with 5+ years of UAE experience. Understands the anxiety a candidate feels when not counselled well — the primary bridge between us and our UAE-based client organisations.",
  },
  {
    name: "Mr. Ramesh Bhati",
    role: "Indian Client Supervisor",
    img: "/team/bhati.jpg",
    bio: "20+ years of experience in client management, advertising and lead generation. Brings fresh marketing strategies and sales techniques to the team. You'll usually find him in Chandigarh, India — building new customer relationships in the field.",
  },
];

export default function Team() {
  return (
    <section id="team" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#C5A059] mb-4">Meet The Team</p>
            <h2 className="font-serif-display text-4xl sm:text-5xl leading-[1.05] tracking-tight max-w-xl">
              The people behind your <span className="italic text-[#C5A059]">UAE setup.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            A small, specialised team — each responsible for a discipline critical to your business, visa or career in the Emirates.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {TEAM.map((t) => (
            <article
              key={t.name}
              className="group border hairline bg-white overflow-hidden flex flex-col"
              data-testid={`team-${t.name.toLowerCase().replace(/[^a-z]+/g, "-")}`}
            >
              <TeamPhoto name={t.name} src={t.img} />
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-serif-display text-xl leading-tight">{t.name}</h3>
                <p className="text-[10px] uppercase tracking-widest text-[#C5A059] mt-1">{t.role}</p>
                <p className="mt-3 text-[13px] text-muted-foreground leading-relaxed">{t.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
