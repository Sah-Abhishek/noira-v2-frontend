import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, MapPin, Star, Clock, CheckCircle, XCircle } from "lucide-react";

const ActiveAndInactiveTherapist = () => {
  const [therapists, setTherapists] = useState({ available: [], unavailable: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("available");
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${apiUrl}/admin/active/therapistlist`);

      if (data.success) {
        setTherapists({
          available: data.available || [],
          unavailable: data.unavailable || [],
        });
        setError(null);
      } else {
        setError("Failed to load therapist data");
      }
    } catch (err) {
      console.error("Error fetching therapists:", err);
      setError(err.response?.data?.message || "Failed to fetch therapists");
    } finally {
      setLoading(false);
    }
  };

  const TherapistCard = ({ therapist, isAvailable }) => {
    const user = therapist.userId;

    return (
      <div className="bg-[#111] border border-primary/20 rounded-lg p-6 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={
                user.avatar_url ||
                "https://www.citypng.com/public/uploads/preview/white-user-member-guest-icon-png-image-701751695037005zdurfaim0y.png?v=2025073005"
              }
              alt={`${user.name.first} ${user.name.last}`}
              className="w-20 h-20 rounded-full object-cover border-2 border-primary/30"
              loading="lazy"
            />
            {isAvailable ? (
              <CheckCircle className="absolute -bottom-1 -right-1 w-6 h-6 text-green-500 bg-[#111] rounded-full" />
            ) : (
              <XCircle className="absolute -bottom-1 -right-1 w-6 h-6 text-red-500 bg-[#111] rounded-full" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-primary">
                {therapist.title || `${user.name.first} ${user.name.last}`}
              </h3>
              {user.emailVerified && (
                <span className="text-xs bg-primary text-black px-2 py-1 rounded">
                  Verified
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
              <MapPin className="w-4 h-4" />
              <span>
                {user.address?.PostTown || "Unknown"}, {user.address?.PostalCode || ""}
              </span>
            </div>

            {therapist.bio && (
              <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                {therapist.bio}
              </p>
            )}

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-300">
                  {therapist.experience || 0} years
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-sm text-gray-300">
                  {therapist.rating || 0} ({therapist.ratingCount || 0} reviews)
                </span>
              </div>
            </div>

            {therapist.languages && therapist.languages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {therapist.languages.slice(0, 3).map((lang, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-primary text-black px-2 py-1 rounded border border-primary/20"
                  >
                    {lang}
                  </span>
                ))}
                {therapist.languages.length > 3 && (
                  <span className="text-xs text-gray-400 px-2 py-1">
                    +{therapist.languages.length - 3} more
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{user.email || "N/A"}</span>
              <span className="text-xs text-gray-400">{user.phone || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary text-lg">Loading therapists...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl mb-4">{error}</p>
          <button
            onClick={fetchTherapists}
            className="bg-primary text-black px-6 py-2 rounded-lg hover:bg-primary transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentList =
    activeTab === "available" ? therapists.available : therapists.unavailable;

  return (
    <div className=" mt-10 bg-[#111] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Therapists</h1>
          <p className="text-gray-400">Manage and view all therapists</p>
        </header>

        <div className="flex gap-4 mb-6 border-b border-primary/20">
          <button
            onClick={() => setActiveTab("available")}
            className={`px-6 py-3 font-semibold transition-all ${activeTab === "available"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-400 hover:text-primary"
              }`}
          >
            Available ({therapists.available.length})
          </button>
          <button
            onClick={() => setActiveTab("unavailable")}
            className={`px-6 py-3 font-semibold transition-all ${activeTab === "unavailable"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-400 hover:text-primary"
              }`}
          >
            Unavailable ({therapists.unavailable.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {currentList.length > 0 ? (
            currentList.map((therapist) => (
              <TherapistCard
                key={therapist._id}
                therapist={therapist}
                isAvailable={activeTab === "available"}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                No {activeTab} therapists found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveAndInactiveTherapist;
