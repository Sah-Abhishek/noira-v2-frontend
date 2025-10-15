import React, { useEffect, useState } from 'react';
import devineHand from '../assets/devineHand.png';
import dumbell from '../assets/dumbell.png';
import leave from '../assets/leaf.png';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const iconMap = {
  'Classic Reset': devineHand,
  'Deep Release': dumbell,
  'The NOIRA Ritual': leave,
};

const apiUrl = import.meta.env.VITE_API_URL;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Services = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const sectionBg = isDarkMode ? 'bg-black text-white' : 'bg-gray-200/70 text-black';
  const descriptionText = isDarkMode ? 'text-gray-400' : 'text-gray-600';

  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${apiUrl}/services/list`);
        const data = await res.json();

        const mappedServices = data.map(service => ({
          title: service.name,
          description: service.description,
          options: service.options, // 👈 keep full options here
          icon: iconMap[service.name] || devineHand,
          image: service.image_url,
        }));

        setServices(mappedServices);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      }
    };

    fetchServices();
  }, []);

  const handleOnClick = () => navigate('/allservicespage');

  return (
    <section className={`${sectionBg} py-16 px-4 sm:px-6 md:px-10 lg:px-20`} id="services">
      {/* Section Header */}
      <motion.div
        className="text-center mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl sm:text-4xl text-[#D59940] font-braven font-bold">
          Our Services
        </h2>
        <p className={`${descriptionText} mt-4 text-sm sm:text-base`}>
          Premium wellness treatments tailored to your needs
        </p>
      </motion.div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
        {services.map((service, index) => (
          <motion.div
            key={index}
            className={`
              relative flex flex-col h-full 
              rounded-3xl transition-all duration-300
              shadow-xl overflow-hidden
              ${isDarkMode
                ? 'bg-gradient-to-br from-[#0c0c0c] to-[#1a1a1a] border border-gray-800'
                : 'bg-gray-100 border border-gray-300'
              }
              hover:shadow-2xl hover:shadow-[#C49E5B]/20 
              hover:-translate-y-2
            `}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: index * 0.15 }}
          >
            {/* Image */}
            <div className="relative w-full h-52 bg-black">
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 transition-opacity duration-300"></div>
            </div>

            {/* Content */}
            <div className="p-8 flex-grow flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gradient-to-br from-[#f5e18c] via-[#e0a528] to-[#a66c00] p-3 rounded-full flex-shrink-0 ring-2 ring-offset-2 ring-offset-current ring-[#C49E5B]">
                  <img
                    src={service.icon}
                    alt={service.title}
                    className="w-8 h-8 object-contain"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-2xl sm:text-2xl text-[#D59940] font-braven font-semibold leading-none">
                  {service.title}
                </h3>
              </div>

              <p className={`${descriptionText} text-sm sm:text-base mb-4 flex-grow`}>
                {service.description}
              </p>

              {/* Options with all prices */}
              <div className="mb-4">
                <h4 className="text-xs uppercase tracking-wide mb-2 text-[#D59940]">
                  Durations & Prices
                </h4>
                <div className="flex flex-wrap gap-2">
                  {service.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={handleOnClick}
                      className="px-3 py-1 rounded-full text-xs font-semibold text-[#D59940] border border-[#D59940] hover:bg-[#D59940] hover:text-black transition"
                    >
                      {opt.durationMinutes} min • £{opt.price.amount}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleOnClick}
                className="mt-auto bg-[#D59940] font-bold text-black rounded-full px-3 py-2"
              >
                See More
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Services;
