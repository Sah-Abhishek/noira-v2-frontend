import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet"; // ✅ for SEO meta tags
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Star, Award, X } from "lucide-react";

const FeaturedTherapists = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/therapist/getalltherapists?page=1&limit=3`
        );

        if (res.data?.therapists) {
          setTherapists(res.data.therapists);
        } else {
          console.error("Unexpected API response:", res.data);
        }
      } catch (err) {
        console.error("Error fetching therapists:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, [apiUrl]);

  if (loading) {
    return (
      <section
        aria-label="Loading therapist profiles"
        className="py-20 bg-[#111] px-6 md:px-20 text-center"
      >
        <p className="text-gray-400">Loading therapists...</p>
      </section>
    );
  }

  return (
    <section
      id="therapists"
      className="py-20 px-6 md:px-20 bg-[#111]"
      role="region"
      aria-labelledby="therapists-heading"
    >
      {/* ✅ SEO Meta */}
      <Helmet>
        <title>Top Therapists | Certified Wellness Professionals</title>
        <meta
          name="description"
          content="Discover our top certified therapists specializing in mental wellness, stress management, and personal growth."
        />
        <meta
          name="keywords"
          content="therapists, wellness professionals, mental health, therapy, online therapy"
        />
      </Helmet>

      <div className="text-center mb-16">
        <h2
          id="therapists-heading"
          className="text-4xl text-primary font-braven font-bold"
        >
          Our Top <span className="text-primary">Therapists</span>
        </h2>
        <p className="mt-4 text-gray-400">
          Meet our certified wellness professionals
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mx-10">
        {therapists.map((therapist) => {
          const fullName =
            therapist?.profile?.title ||
            `${therapist?.name?.first || ""} ${therapist?.name?.last || ""}`.trim();

          const rating =
            therapist?.profile?.rating && therapist.profile.rating > 0
              ? therapist.profile.rating
              : (Math.random() * (5 - 4) + 4).toFixed(1);

          const experience = therapist?.profile?.experience || 0;
          const specializations = therapist?.profile?.specializations || [];
          const bio = therapist?.profile?.bio || "";
          const image = therapist?.avatar_url;

          return (
            <article
              key={therapist._id}
              className="relative bg-[#1a1a1a] rounded-2xl p-8 border shadow-lg shadow-primary border-primary transition-all duration-300"
              itemScope
              itemType="https://schema.org/Person"
            >
              <meta itemProp="jobTitle" content="Therapist" />
              <meta itemProp="worksFor" content="Wellness Center" />

              <div className="relative z-10 text-center space-y-5">
                {/* Profile Image */}
                <div
                  className="relative inline-block cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-primary mx-auto">
                    {image ? (
                      <img
                        src={image}
                        alt={`${fullName} - certified therapist`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        itemProp="image"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center text-primary text-lg font-bold">
                        {fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-white" itemProp="name">
                  {fullName}
                </h3>

                {/* Rating */}
                <div
                  className="flex items-center justify-center space-x-2"
                  itemProp="aggregateRating"
                  itemScope
                  itemType="https://schema.org/AggregateRating"
                >
                  <meta itemProp="ratingValue" content={rating} />
                  <meta itemProp="bestRating" content="5" />
                  <meta itemProp="worstRating" content="1" />
                  <div className="flex text-primary" aria-label={`Rating: ${rating} stars`}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(rating)
                            ? "fill-primary"
                            : "fill-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-300 text-sm font-medium">
                    {rating}
                  </span>
                </div>

                {/* Short Bio */}
                {bio && (
                  <p
                    className="text-sm text-gray-400 line-clamp-3 mt-2"
                    itemProp="description"
                  >
                    {bio.length > 150 ? bio.slice(0, 150) + "..." : bio}
                  </p>
                )}

                {/* Specializations */}
                {specializations.length > 0 && (
                  <div
                    className="flex flex-wrap justify-center gap-2 mt-3"
                    aria-label="Specializations"
                  >
                    <h4 className="w-full text-white font-semibold">
                      Specializations
                    </h4>
                    {specializations.slice(0, 4).map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-black shadow"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Experience */}
                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-white mt-3">
                  <Award className="w-4 h-4 text-primary" />
                  <span itemProp="experienceInYears">
                    {experience}+ Years Experience
                  </span>
                </div>

                {/* CTA */}
                <button
                  onClick={() => navigate("/browsetherapists")}
                  className="py-3 px-10 rounded-full bg-primary text-black font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 mt-6"
                  aria-label={`Select ${fullName}`}
                >
                  Select Therapist
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* ✅ Modal for Enlarged Image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Therapist image preview"
        >
          <div
            className="relative max-w-3xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80"
              onClick={() => setSelectedImage(null)}
              aria-label="Close image modal"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Therapist preview"
              className="w-full h-auto max-h-[80vh] rounded-lg object-contain shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedTherapists;
