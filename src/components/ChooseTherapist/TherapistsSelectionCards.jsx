import React from "react";
import { Star, Globe } from "lucide-react";
import useBookingStore from "../../store/bookingStore";
import { useNavigate } from "react-router-dom";

const TherapistSelectionCard = ({ therapist }) => {
  const { setSelectedTherapist, selectedTherapist } = useBookingStore();
  const navigate = useNavigate();

  // Rating logic
  const rawRating = therapist?.rating ?? 0;
  const rating =
    rawRating === 0
      ? (Math.random() * (5 - 4) + 4).toFixed(1) // random between 4.0–5.0
      : rawRating.toFixed(1);

  const ratingCount =
    therapist?.ratingCount && therapist?.ratingCount > 0
      ? therapist.ratingCount
      : Math.floor(Math.random() * 50 + 10); // fallback reviews

  const isSelected = selectedTherapist?._id === therapist?._id;

  const handleSelect = () => {
    setSelectedTherapist(therapist);
    console.log("Selected therapist:", therapist);
  };

  // ✅ Bio handling
  const bio = therapist?.bio || therapist?.profile?.bio || "";
  const shortBio = bio.length > 150 ? bio.slice(0, 150) + "..." : bio;

  return (
    <div
      className={`bg-[#111] text-white rounded-xl shadow-md 
        flex flex-col items-center gap-4 
        transition-all duration-300 w-full 
        sm:max-w-sm md:max-w-md lg:max-w-lg 
        p-5 sm:p-6 md:p-8
        border mx-auto
        ${isSelected
          ? "border-primary shadow-[0_0_20px_rgba(251,191,36,0.6)] scale-[1.03]"
          : "border-white/10 hover:scale-[1.01]"
        }
      `}
    >
      {/* Avatar */}
      <div className="relative">
        <img
          src={
            therapist?.userId?.avatar_url || "https://via.placeholder.com/80"
          }
          alt={therapist?.title || "Therapist"}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-primary object-cover"
        />
        <span
          className={`absolute top-0 right-0 w-3 h-3 rounded-full border-2 border-black ${therapist?.acceptingNewClients ? "bg-green-500" : "bg-gray-400"
            }`}
        ></span>
      </div>

      {/* Name */}
      <h2 className="text-base sm:text-lg md:text-xl font-bold text-center leading-tight">
        {therapist?.title || "Therapist"}
      </h2>

      {/* Title */}
      <p className="text-primary text-xs sm:text-sm md:text-base font-medium">
        Massage Therapist
      </p>

      {/* Rating */}
      <div className="flex items-center gap-1 text-xs sm:text-sm">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3 h-3 sm:w-4 sm:h-4 ${star <= Math.round(rating)
                  ? "text-primary fill-primary"
                  : "text-gray-500"
                }`}
            />
          ))}
        </div>
        <span className="font-semibold ml-1">{rating}</span>
        {/* <span className="text-gray-400">({ratingCount} reviews)</span> */}
      </div>

      {/* ✅ Short Bio */}
      {shortBio && (
        <p className="text-gray-400 text-xs sm:text-sm text-center mt-1">
          {shortBio}
        </p>
      )}

      {/* Specializations */}
      <div className="flex flex-wrap justify-center gap-2">
        {(therapist?.specializations || []).map((spec, idx) => (
          <span
            key={spec._id || idx}
            className="px-2 py-1 text-[10px] sm:text-xs rounded-full bg-primary text-black font-medium"
          >
            {spec.name}
          </span>
        ))}
      </div>

      {/* Languages */}
      <div className="flex items-center gap-1 text-gray-400 text-xs sm:text-sm">
        <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
        <span>{therapist?.languages?.join(", ") || "English, Spanish"}</span>
      </div>

      {/* Select Button */}
      <button
        onClick={handleSelect}
        className={`w-full py-2 sm:py-3 px-6 sm:px-8 rounded-full font-semibold transition-colors text-sm sm:text-base mt-2
          ${isSelected
            ? "bg-gray-800 text-white"
            : "bg-primary text-black hover:bg-yellow-400"
          }`}
      >
        {isSelected ? "Selected" : "Select"}
      </button>
    </div>
  );
};

export default TherapistSelectionCard;
