import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCrown,
  FaHands,
  FaBriefcase,
  FaHeart,
  FaPlane,
  FaArrowLeft,
} from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";
import useBookingStore from "../../store/bookingStore.jsx";
import { useNavigate } from "react-router-dom";
import StickyCartSummary from "../ChooseTherapist/StickyCartSummary.jsx";

export default function ServiceByTherapist() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});
  const { cart, setCart, selectedTherapist } = useBookingStore();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const therapistId = selectedTherapist._id;
  const authToken = localStorage.getItem("userjwt");
  console.log("This is the selected Option: ", selectedOptions);

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/therapist/${therapistId}/services`,
        {
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        }
      );

      if (Array.isArray(response.data)) {
        setServices(response.data);
      } else if (response.data.services) {
        setServices(response.data.services);
      } else if (response.data.success) {
        setServices(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const icons = [
    FaClockRotateLeft,
    FaCrown,
    FaHands,
    FaBriefcase,
    FaHeart,
    FaPlane,
  ];
  const bgImages = [
    "./pic3.jpeg",
    "./pic.jpeg",
    "./pic.jpeg",
    "./pic.jpeg",
    "./pic.jpeg",
    "./pic4.jpeg",
  ];

  const handleSelect = (service, option, optionIndex) => {
    // ✅ allow saving to cart even if not logged in
    setSelectedOptions({ [service._id]: option });
    setCart({
      serviceId: service._id,
      serviceName: service.name,
      optionIndex,
      durationMinutes: option.durationMinutes,
      id: option._id,
      price: option.price.amount,
    });
  };

  const handleContinue = () => {
    if (!cart) return;
    navigate("/findtherapistbyavailability");
  };

  const ServiceSkeleton = () => (
    <div className="service-card rounded-3xl overflow-hidden gold-foil p-8 animate-pulse h-64"></div>
  );

  return (
    <div className="bg-noira-black text-noira-ivory min-h-screen p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 mt-20 relative">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 border-primary border md:border-transparent hover:border-white rounded-full px-3 py-2 text-noira-gold hover:text-noira-gold-light transition
               md:absolute md:left-0 md:top-0 mb-6 md:mb-0"
          >
            <FaArrowLeft /> Back
          </button>

          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-primary">
            Massage Menu
          </h1>
          <h2 className="text-center text-lg">Luxury Made Accessible</h2>
          <p className="text-gray-300 text-xl font-light">
            Choose from our premium wellness treatments
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
              <ServiceSkeleton key={i} />
            ))
            : services.map((service, idx) => {
              const Icon = icons[idx % icons.length];
              const bg = bgImages[idx % bgImages.length];
              const selectedOpt = selectedOptions[service._id];

              return (
                <div
                  key={service._id}
                  className={`service-card mb-30 rounded-3xl overflow-hidden gold-foil group cursor-pointer ${cart?.serviceId === service._id ? "ring-2 ring-noira-gold" : ""
                    }`}
                  style={{ backgroundImage: `url(${bg})` }}
                >
                  <div className="specular-sweep"></div>
                  <div className="texture-grain absolute inset-0 z-1"></div>

                  <div className="glass-panel rounded-3xl p-6 m-4 h-[calc(100%-2rem)] relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-3 bg-noira-gold/10 rounded-2xl backdrop-blur-sm">
                        <Icon className="text-noira-gold text-2xl" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="price-display bg-gradient-to-r from-noira-gold to-noira-gold-light text-noira-black px-3 py-1 rounded-full text-xs font-bold opacity-80">
                          {selectedOpt
                            ? `£${selectedOpt.price.amount}`
                            : `From £${Math.min(
                              ...service.options.map((o) => o.price.amount)
                            )}`}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-serif text-xl font-bold mb-3 text-noira-ivory">
                      {service.name}
                    </h3>
                    <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Options */}
                    <div className="mb-6">
                      <h4 className="text-noira-gold text-xs font-medium mb-3 uppercase tracking-wider">
                        Select Duration
                      </h4>

                      <div className="flex flex-wrap gap-2">
                        {service.options.map((opt, index) => {
                          const isActive = selectedOpt?._id === opt._id;
                          return (
                            <button
                              key={opt._id}
                              onClick={() => handleSelect(service, opt, index)}
                              className={`duration-chip px-4 py-2 rounded-full text-xs font-medium transition-all
    ${isActive
                                  ? "bg-noira-gold text-black shadow-lg shadow-noira-gold/30 scale-110 ring-2 ring-noira-gold"
                                  : "text-noira-gold border border-noira-gold hover:bg-noira-gold/10 hover:scale-105"
                                }`}
                            >
                              {opt.durationMinutes} min • £{opt.price.amount}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-noira-gold/20">
                      <div className="flex items-center text-gray-400 text-xs">
                        <span className="selected-duration">
                          {selectedOpt
                            ? `${selectedOpt.durationMinutes} min selected`
                            : "Select duration"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {Object.keys(selectedOptions).length > 0 && (
        <StickyCartSummary isAbled={true} onContinue={handleContinue} />
      )}
    </div>
  );
}
