import { useEffect, useState } from "react";
import Nav from "../components/site/Nav";
import Hero from "../components/site/Hero";
import About from "../components/site/About";
import Services from "../components/site/Services";
import TaxiVisa from "../components/site/TaxiVisa";
import WhyChooseUs from "../components/site/WhyChooseUs";
import Industries from "../components/site/Industries";
import Process from "../components/site/Process";
import DynamicUpdates from "../components/site/DynamicUpdates";
import Team from "../components/site/Team";
import Reviews from "../components/site/Reviews";
import FAQSection from "../components/site/FAQSection";
import SurveyForm from "../components/site/SurveyForm";
import Footer from "../components/site/Footer";
import api from "../lib/api";

export default function Home() {
  const [updates, setUpdates] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get("/updates/list").then((r) => setUpdates(r.data || [])).catch(() => {});
    api.get("/reviews").then((r) => setReviews(r.data || [])).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Nav />
      <main>
        <Hero />
        <About />
        <Services />
        <TaxiVisa />
        <WhyChooseUs />
        <Process />
        <Industries />
        <DynamicUpdates updates={updates} />
        <Team />
        <Reviews reviews={reviews} />
        <FAQSection />
        <SurveyForm />
      </main>
      <Footer />
    </div>
  );
}
