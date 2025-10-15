import { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

import FloatingCartButton from "../components/ServicesPage/FloatingActionButton.jsx";
import useBookingStore from "../store/bookingStore.jsx";
import CartPage from "./CartPage.jsx";
import HeroSectionServices from "../components/ServicesPage/HeroSectionServices.jsx";
import MassageServiceSkeleton from "../components/ServicesPage/MassageServicesSkeletonCard.jsx";
import MassageServiceCard from "../components/ServicesPage/MassageServiceCards.jsx";
import FooterSection from "../components/FooterSection.jsx";

const ServicesPage = () => {
  const [loading, setLoading] = useState(true);

  const authToken = localStorage.getItem("userjwt");
  const apiUrl = import.meta.env.VITE_API_URL;

  const { cart, setCart, resetCart, services, setServices } = useBookingStore();

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${apiUrl}/services/list`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setServices(response.data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!services || services.length === 0) {
      fetchServices();
    } else {
      setLoading(false);
    }
  }, []);

  const addToCart = (service, optionIndex) => {
    const option = service.options[optionIndex];
    setCart({
      serviceId: service._id,
      serviceName: service.name,
      optionIndex,
      duration: option.durationMinutes,
      price: option.price.amount,
    });
  };

  const removeFromCart = () => {
    resetCart();
  };

  const hasCart = cart && Object.keys(cart).length > 0;

  return (
    <div className="bg-[#0f172a] text-white min-h-screen">
      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>Luxury Massage Services in London | Noira Wellness</title>
        <meta
          name="description"
          content="Explore Noira's luxury massage services in London. Choose from elite, discreet, and mobile massage experiences tailored to your energy and schedule."
        />
        <link rel="canonical" href="https://www.noira.co.uk/services" />
        <meta property="og:title" content="Luxury Massage Services in London | Noira Wellness" />
        <meta
          property="og:description"
          content="Indulge in premium at-home massage treatments across Mayfair, Chelsea, Knightsbridge & Canary Wharf. Book your bespoke experience today."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.noira.co.uk/services" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Hero Section (contains main H1 for SEO) */}
      <HeroSectionServices />

      {/* Main Content */}
      <main className="bg-black w-full px-4 py-12">
        <section
          className={`max-w-7xl mx-auto transition-all duration-500 ease-in-out gap-6 ${
            hasCart ? "flex flex-col lg:flex-row" : "flex justify-center"
          }`}
          aria-labelledby="massage-services"
        >
          {/* Heading for crawlers + accessibility */}
          <h2 id="massage-services" className="sr-only">
            Massage Services List
          </h2>

          {/* Services Grid */}
          <div className={`${hasCart ? "flex-1" : "w-full lg:w-3/4"} space-y-6`}>
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <MassageServiceSkeleton key={i} />
                ))
              : services.map((s) => (
                  <MassageServiceCard
                    key={s._id}
                    service={s}
                    cart={cart ? [cart] : []}
                    addToCart={addToCart}
                    removeFromCart={removeFromCart}
                  />
                ))}
          </div>

          {/* Cart Sidebar */}
          {hasCart && (
            <aside className="w-full lg:w-[450px] lg:sticky lg:top-24">
              <CartPage />
            </aside>
          )}
        </section>
      </main>

      {/* Footer */}
      <FooterSection />

      {/* Floating Cart Button */}
      <FloatingCartButton
        cart={cart ? [cart] : []}
        disabled={!hasCart}
        onChooseTherapist={() => console.log("Go to date & time picker")}
      />
    </div>
  );
};

export default ServicesPage;
