import React from "react";
import { Helmet } from "react-helmet";

import HeroSection from "../components/HeroSection";
import Services from "../components/Services";
import Featuredtherapists from "../components/FeaturedTherapist.jsx";
import CtaSection from "../components/CtaSection.jsx";
import Footer from "../components/FooterSection.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import Galleryhome from "../components/Galleryhome.jsx";
import LandingVideoSection from "../components/VideoHome.jsx";
import WhyChooseNoira from "../components/WhyChooseNoira.jsx";
import MembershipSection from "../components/MembershipSection.jsx";
import AtHomeTreatment from "../components/AtHomeTreatment.jsx";
import SubscriptionsSection from "../components/SubscriptionSection.jsx";
import MonthlySubscription from "../components/MonthlySubscription.jsx";

const LandingPage = () => {
  return (
    <div>
      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>
          Luxury Massage London | Mobile Massage Mayfair | Discreet Elite Massage
        </title>
        <meta
          name="description"
          content="Experience Luxury Massage in London with our Mobile Massage service in Mayfair, Knightsbridge, Chelsea & Canary Wharf. Book a discreet elite massage at your home, hotel or office."
        />
        <link rel="canonical" href="https://www.noira.co.uk/" />

        {/* Open Graph for social media */}
        <meta property="og:title" content="Luxury Massage London | Mobile Massage Mayfair" />
        <meta
          property="og:description"
          content="Elite discreet massage services across Mayfair, Chelsea, Knightsbridge & Canary Wharf. Book your luxury massage today."
        />
        <meta property="og:url" content="https://www.noira.co.uk/" />
        <meta property="og:type" content="website" />

        {/* Twitter card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Luxury Massage London | Mobile Massage Mayfair" />
        <meta
          name="twitter:description"
          content="Discreet elite massage services across London – Mayfair, Knightsbridge, Chelsea, Canary Wharf."
        />
      </Helmet>

      {/* ✅ Your existing landing page sections */}
      <HeroSection />
      <WhyChooseNoira />
      <Galleryhome />
      <Services />
      <HowItWorks />
      {/* <MembershipSection /> */}
      <SubscriptionsSection />
      <MonthlySubscription />
      <LandingVideoSection />
      <Featuredtherapists />
      <AtHomeTreatment />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
