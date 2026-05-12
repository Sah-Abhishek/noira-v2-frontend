import React, { useState } from "react";
import { FaStar, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import { MdDelete, MdEdit, MdVisibility } from "react-icons/md";
import FancyCheckbox from "./FancyCheckBox";
import DeleteTherapistModal from "./DeleteTherapistModal";
import TherapistProfileModal from "../TherspistProfile/TherapistProfileModal";
import { useNavigate } from "react-router-dom";
import { CalendarCheck } from "lucide-react";
import TherapistScheduleModalAdmin from "./TherapistScheduleModalAdmin.jsx";

function TherapistAvatar({ src, alt }) {
  const [errored, setErrored] = useState(false);
  const showFallback = !src || errored;

  if (showFallback) {
    return (
      <div
        role="img"
        aria-label={alt || "No profile image"}
        className="w-12 h-12 rounded-full object-cover border border-white/20 bg-[#1a1a1a] flex items-center justify-center text-gray-500"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="w-7 h-7"
        >
          <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9v2.4h19.6v-2.4c0-3.3-6.5-4.9-9.8-4.9z" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-12 h-12 rounded-full object-cover border border-white/20"
      onError={() => setErrored(true)}
    />
  );
}

export default function TherapistTable({
  therapists,
  loading,
  selectedTherapists,
  setSelectedTherapists,
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [therapistToDelete, setTherapistToDelete] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedTherapistId, setSelectedTherapistId] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // console.log("This is the therapistId:", therapists);

  const navigate = useNavigate();

  // ✅ consistently grab unique id
  const getTherapistId = (t) => t.profile?._id || t.email;

  const handleViewProfile = (therapist) => {
    setSelectedTherapistId(getTherapistId(therapist));
    setIsProfileModalOpen(true);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTherapists([...therapists]); // store full objects
    } else {
      setSelectedTherapists([]);
    }
  };

  const handleClickTrash = (therapist) => {
    setTherapistToDelete(therapist);
    setIsDeleteModalOpen(true);
  };

  const handleSelectOne = (therapist) => {
    const id = getTherapistId(therapist);
    const alreadySelected = selectedTherapists.some(
      (t) => getTherapistId(t) === id
    );

    if (alreadySelected) {
      setSelectedTherapists(
        selectedTherapists.filter((t) => getTherapistId(t) !== id)
      );
    } else {
      setSelectedTherapists([...selectedTherapists, therapist]);
    }
  };

  if (loading) {
    return (
      <div className="overflow-x-auto rounded-xl bg-[#0d0d0d] border border-white/10">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-[#111] z-10">
            <tr className="text-gray-300 border-b border-white/20 text-left">
              <th className="p-3"></th>
              <th className="p-3">Profile</th>
              <th className="p-3">Name & Title</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Location</th>
              <th className="p-3">Languages</th>
              <th className="p-3">Experience</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
              <th className="p-3">Schedule</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-b border-white/10 animate-pulse">
                <td className="p-3">
                  <div className="w-4 h-4 rounded bg-gray-700" />
                </td>
                <td className="p-3">
                  <div className="w-12 h-12 rounded-full bg-gray-700" />
                </td>
                <td className="p-3">
                  <div className="h-4 w-32 bg-gray-700 rounded mb-2" />
                  <div className="h-3 w-24 bg-gray-800 rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!therapists || therapists.length === 0) {
    return (
      <div className="bg-[#0d0d0d] rounded-xl p-6 text-center text-gray-400 border border-white/10">
        No therapists found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-[#0d0d0d] border border-white/10">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-[#111] z-10">
          <tr className="text-gray-300 border-b border-white/20 text-left">
            <th className="p-3">
              <FancyCheckbox
                label=""
                checked={
                  therapists.length > 0 &&
                  selectedTherapists.length === therapists.length
                }
                onChange={handleSelectAll}
              />
            </th>
            <th className="p-3">Profile</th>
            <th className="p-3">Name & Title</th>
            <th className="p-3">Rating</th>
            <th className="p-3">Location</th>
            <th className="p-3">Languages</th>
            <th className="p-3">Experience</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
            <th className="p-3">Schedule</th>
          </tr>
        </thead>
        <tbody>
          {therapists.map((t) => {
            const id = getTherapistId(t);
            const isChecked = selectedTherapists.some(
              (st) => getTherapistId(st) === id
            );

            return (
              <tr
                key={id}
                className={`border-b border-white/10 hover:bg-[#181818] transition ${isChecked ? "bg-gray-800" : ""
                  }`}
              >
                {/* Select */}
                <td className="p-3">
                  <FancyCheckbox
                    label=""
                    checked={isChecked}
                    onChange={() => handleSelectOne(t)}
                  />
                </td>

                {/* Profile */}
                <td className="p-3">
                  <TherapistAvatar
                    src={t.avatar_url}
                    alt={t.profile?.title || t.name?.first}
                  />
                </td>

                {/* Name */}
                <td className="p-3">
                  <p className="font-semibold text-white">
                    {t.profile?.title || `${t.name?.first} ${t.name?.last}`}
                  </p>
                  <p className="text-gray-400 text-xs">{t.email}</p>
                </td>

                {/* Rating */}
                <td className="p-3 flex items-center gap-1">
                  <FaStar className="text-yellow-400" />
                  {t.profile?.rating || 0}
                  <span className="text-gray-400 text-xs">
                    ({t.profile?.ratingCount || 0})
                  </span>
                </td>

                {/* Location */}
                <td className="p-3">
                  {t.address?.PostTown || "—"}, {t.address?.PostalCode || "—"}
                </td>

                {/* Languages */}
                <td className="p-3">
                  <div className="flex gap-1 flex-wrap">
                    {t.profile?.languages?.length ? (
                      t.profile.languages.map((lang, index) => (
                        <span
                          key={index}
                          className="bg-[#111] border border-white/20 text-xs px-2 py-1 rounded-lg"
                        >
                          {lang}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-xs">—</span>
                    )}
                  </div>
                </td>

                {/* Experience */}
                <td className="p-3">{t.profile?.experience || 0}+ years</td>

                {/* Status */}
                <td className="p-3">
                  <p
                    className={`text-xs ${t.profile?.active ? "text-green-300" : "text-red-400"
                      }`}
                  >
                    {t.profile?.active ? "Active" : "Inactive"}
                  </p>
                </td>

                {/* Actions */}
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <button
                      title="View"
                      onClick={() => handleViewProfile(t)}
                      className="text-blue-400 hover:text-blue-500 transition"
                    >
                      <MdVisibility />
                    </button>
                    <button
                      title="Edit"
                      onClick={() =>
                        navigate(`/admin/edittherapistprofileadmin/${t?.profile?._id}`)
                      }
                      className="text-yellow-400 hover:text-yellow-500 transition"
                    >
                      <MdEdit />
                    </button>
                    <button
                      title="Delete"
                      onClick={() => handleClickTrash(t)}
                      className="text-red-400 hover:text-red-500 transition"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </td>

                {/* Schedule */}
                <td className="p-3">
                  <div className="flex items-center justify-center">
                    <button
                      title="View Schedule"
                      onClick={() => {
                        setSelectedTherapistId(t.profile._id);
                        setIsScheduleModalOpen(true);
                      }}
                      className="text-green-400 hover:text-green-500 transition"
                    >
                      <CalendarCheck />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modals */}
      <DeleteTherapistModal
        therapist={therapistToDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
      <TherapistProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        therapistId={selectedTherapistId}
      />
      <TherapistScheduleModalAdmin isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen()} therapistId={selectedTherapistId} />

    </div >
  );
}
