import React from "react";
import { Helmet } from "react-helmet";

function AutoPlayVideo() {
  return (
    <section
      id="noira-gallery"
      className="bg-black text-white py-12 pt-25 px-4 text-center relative"
    >
      {/* ✅ SEO Meta Tags for this section */}
      <Helmet>
        <title>Noira Gallery | Luxury Massage Experience in London</title>
        <meta
          name="description"
          content="Explore Noira’s luxury massage experience through our exclusive photo gallery. See how we bring elite wellness directly to your home, hotel, or office in London."
        />
        <meta
          property="og:title"
          content="Noira Gallery | Luxury Massage London"
        />
        <meta
          property="og:description"
          content="Experience Noira’s discreet and luxurious mobile massage service across London – Mayfair, Chelsea, Knightsbridge & Canary Wharf."
        />
        <meta property="og:image" content="https://www.noira.co.uk/pic4.jpeg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.noira.co.uk/gallery" />
        <link rel="canonical" href="https://www.noira.co.uk/gallery" />
      </Helmet>

      {/* ✅ Accessible H1 (only one per page) */}
      <h1 className="sr-only">
        Noira Massage Gallery – Experience Luxury Wellness in London
      </h1>

      {/* Images container */}
      <div className="flex flex-col lg:flex-row justify-center items-center gap-15 relative">
        {/* First Image */}
        <figure className="relative w-full max-w-[720px] aspect-video rounded-lg overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          <img
            src="/pic4.jpeg"
            alt="Luxury massage setup at a London suite"
            className="w-full h-full object-cover rounded-lg"
            loading="lazy" // ✅ Performance
            decoding="async"
          />
          <figcaption className="sr-only">
            Elegant massage environment with soft lighting and premium decor.
          </figcaption>
        </figure>

        {/* Second Image */}
        <figure className="relative w-full max-w-[720px] aspect-video rounded-lg overflow-hidden shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          <img
            src="/pic3.jpeg"
            alt="Professional therapist providing mobile massage service in London"
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
            decoding="async"
          />
          <figcaption className="sr-only">
            Noira’s professional therapist delivering an elite mobile massage
            experience in London.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export default AutoPlayVideo;
