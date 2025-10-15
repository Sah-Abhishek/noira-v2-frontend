import React from "react";
import { X, Trash, CheckCircle, UserX } from "lucide-react";

export default function BulkActionConfirmModal({
  isOpen,
  onClose,
  action,
  therapists,
  onConfirm,
}) {
  if (!isOpen) return null;

  const actionLabels = {
    delete: { label: "Delete", icon: <Trash className="text-red-500" /> },
    active: { label: "Set Active", icon: <CheckCircle className="text-green-500" /> },
    inactive: { label: "Set Inactive", icon: <UserX className="text-yellow-500" /> },
  };
  console.log("These are the therapists: ", therapists);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0d0d0d] rounded-2xl shadow-2xl border border-[#222] w-full max-w-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#111] p-2 rounded-lg">
            {actionLabels[action]?.icon}
          </div>
          <h2 className="text-xl font-bold text-primary">
            Confirm {actionLabels[action]?.label}
          </h2>
        </div>

        {/* Body */}
        <div className="bg-[#111] p-4 rounded-xl mb-6 max-h-60 overflow-y-auto">
          {therapists.map((t, i) => {
            const user = t.profile?.userId || t;
            const avatar = user?.avatar_url || "/default-avatar.png";
            const name = `${user?.name?.first || ""} ${user?.name?.last || ""}`.trim();

            return (
              <div
                key={t._id || t.profile?._id || i}
                className="flex items-center gap-3 py-2 border-b border-[#222] last:border-0"
              >
                <img
                  src={avatar}
                  alt={name || "Therapist"}
                  className="w-10 h-10 rounded-full border border-[#222] object-cover"
                />
                <p className="text-gray-300 font-medium">{name || "Unnamed Therapist"}</p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#111] text-gray-300 hover:bg-[#222] transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-primary text-black font-semibold hover:opacity-90 transition"
          >
            Confirm {actionLabels[action]?.label}
          </button>
        </div>
      </div>
    </div>
  );
}
