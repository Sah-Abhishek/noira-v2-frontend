
import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext"; // Adjust path if needed
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Star, MapPin } from "lucide-react";

const FeaturedTherapists = () => {
  const navigate = useNavigate();
  const therapistjwt = localStorage.getItem("therapistjwt");

  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/therapist/getalltherapists?page=1&limit=4`, {
          headers: {
            Authorization: `Bearer ${therapistjwt}`,
          },
        }
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
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-[#111] px-6 md:px-20 text-center">
        <p className="text-gray-400">Loading therapists...</p>
      </section>
    );
  }

  return (
    <section id="therapists" className="py-20 px-6 md:px-20 bg-[#111]">
      <div className="text-center mb-16">
        <h2 className="text-4xl text-primary font-braven font-bold">
          Featured <span className="text-primary">Therapists</span>
        </h2>
        <p className="mt-4 text-gray-400">
          Meet our certified wellness professionals
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {therapists.map((therapist) => {
          const fullName = therapist?.profile?.title || `${therapist.name?.first || ""} ${therapist.name?.last || ""}`;
          const rawBio = therapist.profile?.bio || "Certified Therapist";
          const bio =
            rawBio.length > 50 ? rawBio.slice(0, 50) + "..." : rawBio;
          const rating = therapist.profile?.rating || 0;
          const experience = therapist.profile?.experience || 0;
          const specializations = therapist.profile?.specializations || [];
          const image = therapist.avatar_url;
          const location = therapist.address
            ? `${therapist.address.PostTown || ""}, ${therapist.address.PostalCode || ""}`
            : "Location not available";

          return (
            <div key={therapist._id} className="relative">
              {/* Card */}
              <div className="relative bg-[#1a1a1a] rounded-2xl p-8 border border-primary shadow-lg hover:shadow-primary/30 transition-all duration-300">
                <div className="relative z-10 text-center space-y-5">
                  {/* Profile Image */}
                  <div className="relative inline-block">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary mx-auto">
                      {image ? (
                        <img
                          src={image}
                          alt={fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-primary text-lg font-bold">
                          {fullName.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name & Bio */}
                  <div>
                    <h3 className="text-xl font-bold text-white">{fullName}</h3>
                    <p className="text-primary/80 text-sm">{bio}</p>
                  </div>

                  {/* Location & Experience */}
                  <div className="flex flex-col items-center gap-1 text-gray-400 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{location}</span>
                    </div>
                    <span>{experience} years experience</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-center space-x-2">
                    <div className="flex text-primary">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${rating >= i + 1 ? "fill-primary" : "fill-gray-600"
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-300 text-sm font-medium">
                      {rating.toFixed(1)}
                    </span>
                  </div>

                  {/* Specializations */}
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {specializations.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-black shadow"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => navigate("/browsetherapists")}
                    className="w-full py-3 rounded-xl bg-primary text-black font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 mt-6"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedTherapists;
