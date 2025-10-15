import React from "react";
import axios from "axios";
import toast from "react-hot-toast";

const DeleteTherapistModal = ({ isOpen, onClose, therapist }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const adminjwt = localStorage.getItem("adminjwt");

  const handleDeleteTherapist = async () => {
    if (!therapist?.profile?._id) {
      toast.error("Invalid therapist data");
      return;
    }

    try {
      const res = await axios.delete(`${apiUrl}/admin/therapist/${therapist.profile._id}`, {
        headers: {
          Authorization: `Bearer ${adminjwt}`,
        }
      });
      if (res.status === 200) {
        toast.success("Therapist deleted successfully");
        onClose(true); // notify parent
      }
    } catch (error) {
      console.error("Failed to delete therapist:", error);
      toast.error(error.response?.data?.message || "Failed to delete therapist");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-[#0d0d0d]/95 border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100">
        <h2 className="text-xl font-bold text-white mb-4">
          Confirm Delete
        </h2>

        <div className="flex items-center gap-4 mb-6">
          {therapist?.avatar_url ? (
            <img
              src={therapist.avatar_url}
              alt={therapist?.profile?.title || "Therapist"}
              className="w-16 h-16 rounded-full object-cover border border-white/20"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-sm">
              N/A
            </div>
          )}
          <div>
            <p className="text-gray-300">
              {therapist?.profile?.title
                ? `Are you sure you want to delete "${therapist.profile.title}"?`
                : "Are you sure you want to delete this therapist?"}
            </p>
            <p className="text-xs text-gray-500">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => onClose(false)}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteTherapist}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTherapistModal;
