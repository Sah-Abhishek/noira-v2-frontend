import React from "react";
import { Helmet } from "react-helmet"; // ✅ for SEO meta tags

function AtHomeTreatment() {
  const overlayColor = "bg-[#FFA500]/20"; // semi-transparent overlay (unused but kept for consistency)

  return (
    <section
      id="at-home-treatment"
      className="bg-black text-white py-12 pt-25 px-4 text-center relative"
      role="region"
      aria-labelledby="athome-heading"
    >
      {/* ✅ SEO Meta */}
      <Helmet>
        <title>At Home Treatment | Professional Massage Therapy Videos</title>
        <meta
          name="description"
          content="Experience professional at-home massage treatments. Watch our premium guided therapy videos designed to help you relax and rejuvenate at home."
        />
        <meta
          name="keywords"
          content="at home treatment, massage therapy, relaxation, wellness, self care, home spa, body therapy"
        />
      </Helmet>

      {/* Heading */}
      <h2
        id="athome-heading"
        className="text-4xl font-braven text-[#D59940] font-whisper font-bold mb-6 text-center"
      >
        At Home Treatment
      </h2>

      {/* Videos container */}
      <div
        className="flex flex-col lg:flex-row justify-center items-center gap-8 relative"
        role="group"
        aria-label="Massage therapy demonstration videos"
      >
        {/* First Video */}
        <figure
          className="relative w-full max-w-[720px] aspect-video rounded-lg shadow-lg overflow-hidden"
          itemScope
          itemType="https://schema.org/VideoObject"
        >
          <meta itemProp="name" content="Full Body Massage Therapy - Relaxation Guide" />
          <meta
            itemProp="description"
            content="Watch this professional full-body massage therapy session designed for at-home relaxation and wellness."
          />
          <video
            className="w-full h-full object-cover"
            src="/massagevideo8.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Full body massage therapy demonstration video"
          >
            Your browser does not support the video tag.
          </video>
        </figure>

        {/* Second Video */}
        <figure
          className="relative w-full max-w-[720px] aspect-video rounded-lg shadow-lg overflow-hidden"
          itemScope
          itemType="https://schema.org/VideoObject"
        >
          <meta itemProp="name" content="Head and Shoulder Massage Therapy - Relax at Home" />
          <meta
            itemProp="description"
            content="Head and shoulder massage therapy video for deep relaxation and stress relief at home."
          />
          <video
            className="w-full h-full object-cover"
            src="/massagevideo9.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Head and shoulder massage therapy demonstration video"
          >
            Your browser does not support the video tag.
          </video>
        </figure>
      </div>
    </section>
  );
}

export default AtHomeTreatment;
