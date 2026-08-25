import { useEffect, useState } from "react";
import Nav from "../components/site/Nav";
import Hero from "../components/site/Hero";
import About from "../components/site/About";
import CompassOffice from "../components/site/CompassOffice";
import Services from "../components/site/Services";
import TaxiVisa from "../components/site/TaxiVisa";
import WhyChooseUs from "../components/site/WhyChooseUs";
import Industries from "../components/site/Industries";
import Process from "../components/site/Process";
import DynamicUpdates from "../components/site/DynamicUpdates";
import Team from "../components/site/Team";
import ClientsPartners from "../components/site/ClientsPartners";
import Reviews from "../components/site/Reviews";
import FAQSection from "../components/site/FAQSection";
import SurveyForm from "../components/site/SurveyForm";
import CTABanner from "../components/site/CTABanner";
import SurveyDialog from "../components/site/SurveyDialog";
import Footer from "../components/site/Footer";
import api from "../lib/api";

import Login from "./Login";
import Admin from "./Admin";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [updates, setUpdates] = useState([]);
  const [reviews, setReviews] = useState([]);

  const pathname = typeof window !== "undefined" ? window.location.pathname.toLowerCase() : "";
  const search = typeof window !== "undefined" ? window.location.search.toLowerCase() : "";
  const hash = typeof window !== "undefined" ? window.location.hash.toLowerCase() : "";
  const showAdmin = pathname.includes("admin") || pathname.includes("login") || search.includes("admin") || search.includes("login") || hash.includes("admin");

  useEffect(() => {
    api.get("/updates/list").then((r) => setUpdates(r.data || [])).catch(() => {});
    api.get("/reviews").then((r) => setReviews(r.data || [])).catch(() => {});
  }, []);

  if (showAdmin) {
    return user ? <Admin /> : <Login />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Nav />
      <main>
        <Hero />
        <About />
        <CompassOffice />
        <Services />
        <TaxiVisa />
        <WhyChooseUs />
        <Process />
        <Industries />
        <DynamicUpdates updates={updates} />
        <Team />
        <ClientsPartners />
        <Reviews reviews={reviews} />
        <FAQSection />
        <CTABanner />
      </main>
      <Footer />
      <SurveyDialog />
    </div>
  );
}
