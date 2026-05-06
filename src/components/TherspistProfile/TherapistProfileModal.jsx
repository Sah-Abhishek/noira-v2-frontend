
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPin,
  Phone,
  Mail,
  Star,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
} from "lucide-react";

const TherapistProfileModal = ({ isOpen, onClose, therapistId }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const adminjwt = localStorage.getItem("adminjwt");

  useEffect(() => {
    if (!therapistId || !isOpen) return;

    const fetchTherapist = async () => {
      try {
        const res = await axios.get(`${apiUrl}/therapist/${therapistId}`, {
          headers: {
            Authorization: `Bearer ${adminjwt}`,

          }
        });
        setTherapist(res.data.therapist || res.data);
      } catch (error) {
        console.error("Failed to fetch therapist:", error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchTherapist();
  }, [therapistId, apiUrl, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
      <div className="relative w-fit max-w-3xl max-h-[90vh] overflow-y-auto bg-[#121212] rounded-2xl shadow-xl border border-white/10 p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        {loading ? (
          <div className="space-y-8">
            {/* Header skeleton */}
            <div className="flex items-center gap-8">
              <div className="w-32 h-32 rounded-full bg-gray-800 animate-pulse" />
              <div className="flex-1 space-y-4">
                <div className="h-6 w-48 bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-72 bg-gray-700 rounded animate-pulse" />
                <div className="flex gap-3 mt-3">
                  <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Contact / Professional Details skeleton */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="h-5 w-32 bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-56 bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-48 bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-64 bg-gray-800 rounded animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="h-5 w-40 bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-56 bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-52 bg-gray-800 rounded animate-pulse" />
              </div>
            </div>

            {/* Tags skeleton */}
            <div className="space-y-3">
              <div className="h-5 w-40 bg-gray-700 rounded animate-pulse" />
              <div className="flex gap-2 flex-wrap">
                {Array(5)
                  .fill(0)
                  .map((_, idx) => (
                    <div
                      key={idx}
                      className="h-6 w-20 bg-gray-800 rounded-full animate-pulse"
                    />
                  ))}
              </div>
            </div>
          </div>
        ) : !therapist ? (
          <div className="flex justify-center items-center h-40 text-red-500">
            Therapist not found
          </div>
        ) : (<>
          {/* Header */}
          <div className="flex items-center gap-8 mb-10">
            <img
              src={therapist.userId?.avatar_url || "https://via.placeholder.com/150"}
              alt={therapist.title}
              className="w-32 h-32 rounded-full object-cover border border-white/10 shadow-lg"
            />
            <div>
              <h1 className="text-4xl font-bold">{therapist.title}</h1>
              <p className="text-gray-400 mt-1">{therapist.bio || "No bio available"}</p>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Star size={18} />
                  <span>
                    {therapist.rating} ({therapist.ratingCount} reviews)
                  </span>
                </div>
                {therapist.isVerified ? (
                  <span className="flex items-center gap-1 text-green-500 text-sm">
                    <CheckCircle size={16} /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-500 text-sm">
                    <XCircle size={16} /> Not Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Key Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Contact Info</h2>
              <p className="flex items-center gap-2 text-gray-300">
                <Mail size={16} /> {therapist.userId?.email || "N/A"}
              </p>
              <p className="flex items-center gap-2 text-gray-300">
                <Phone size={16} /> {therapist.userId?.phone || "N/A"}
              </p>
              <p className="flex items-center gap-2 text-gray-300">
                <MapPin size={16} />{" "}
                {therapist.userId?.address?.Street
                  ? `${therapist.userId.address.Building_No || ""} ${therapist.userId.address.Street}, ${therapist.userId.address.PostTown || ""} ${therapist.userId.address.PostalCode || ""}`
                  : "Address not available"}
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Professional Details</h2>
              <p className="flex items-center gap-2 text-gray-300">
                <Users size={16} /> {therapist.experience || 0} years experience
              </p>
              <p className="flex items-center gap-2 text-gray-300">
                {therapist.active ? (
                  <span className="text-green-500 flex items-center gap-1">
                    <CheckCircle size={16} /> Accepting New Clients
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center gap-1">
                    <XCircle size={16} /> Not Accepting Clients
                  </span>
                )}
              </p>
              <p className="flex items-center gap-2 text-gray-300">
                <Calendar size={16} /> Joined{" "}
                {new Date(therapist.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Specializations */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Specializations</h2>
            <div className="flex flex-wrap gap-2">
              {therapist.specializations?.length > 0 ? (
                therapist.specializations.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-800 border border-white/10 text-sm rounded-full"
                  >
                    {s.name}
                  </span>
                ))
              ) : (
                <p className="text-gray-400">No specializations listed</p>
              )}
            </div>
          </div>

          {/* Languages */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Languages / Regions</h2>
            <div className="flex flex-wrap gap-2">
              {therapist.languages?.length > 0 ? (
                therapist.languages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-800 border border-white/10 text-sm rounded-full"
                  >
                    {lang}
                  </span>
                ))
              ) : (
                <p className="text-gray-400">No languages listed</p>
              )}
            </div>
          </div>

          {/* Service Postcodes */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Service Areas</h2>
            <div className="flex flex-wrap gap-2">
              {therapist.servicesInPostalCodes?.length > 0 ? (
                therapist.servicesInPostalCodes.map((code, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-800 border border-white/10 text-sm rounded-full"
                  >
                    {code}
                  </span>
                ))
              ) : (
                <p className="text-gray-400">No service postcodes listed</p>
              )}
            </div>
          </div>
        </>
        )}
      </div>
    </div>
  );
};

export default TherapistProfileModal;
