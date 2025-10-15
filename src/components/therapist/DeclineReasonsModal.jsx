import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";

const DeclineReasonsModal = ({ isOpen, onClose, onSubmit, bookingId, clientName }) => {
  const [reasons, setReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingReasons, setLoadingReasons] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const therapistjwt = localStorage.getItem("therapistjwt");

  // Fetch decline reasons from API
  useEffect(() => {
    if (!isOpen) return;

    const fetchReasons = async () => {
      try {
        setLoadingReasons(true);
        setError(null);

        const res = await axios.get(`${apiUrl}/therapist/decline/reasons`, {
          headers: { Authorization: `Bearer ${therapistjwt}` },
        });

        if (res.data?.CANCELLATION_REASONS && Array.isArray(res.data.CANCELLATION_REASONS)) {
          setReasons(res.data.CANCELLATION_REASONS);
        } else {
          setError("No reasons available.");
        }
      } catch (err) {
        console.error("Error fetching decline reasons:", err);
        setError("Failed to load decline reasons.");
      } finally {
        setLoadingReasons(false);
      }
    };

    fetchReasons();
  }, [isOpen, apiUrl, therapistjwt]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedReason) {
      alert("Please select a reason for declining");
      return;
    }

    if (selectedReason === "Other (please specify)" && !customReason.trim()) {
      alert("Please provide a custom reason");
      return;
    }

    setIsSubmitting(true);

    const reason =
      selectedReason === "Other (please specify)" ? customReason : selectedReason;

    try {
      await onSubmit(bookingId, reason);
      handleClose();
    } catch (error) {
      console.error("Error declining booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    setCustomReason("");
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111] rounded-2xl border border-primary/30 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-primary/20">
          <h2 className="text-xl font-semibold text-primary">
            Decline Therapy Request
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-[#1a1a1a]"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-300 text-sm mb-2">
              You are about to decline the therapy request from:
            </p>
            <p className="text-primary font-medium">{clientName}</p>
          </div>

          {loadingReasons ? (
            <p className="text-gray-400 text-sm">Loading reasons...</p>
          ) : error ? (
            <p className="text-red-400 text-sm">{error}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-3">
                  Please select a reason for declining this request:
                </label>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {reasons.map((reason, index) => (
                    <label
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg border border-gray-600 hover:border-primary/40 cursor-pointer transition-colors bg-[#0d0d0d]"
                    >
                      <input
                        type="radio"
                        name="declineReason"
                        value={reason}
                        checked={selectedReason === reason}
                        onChange={(e) => setSelectedReason(e.target.value)}
                        className="mt-1 text-primary focus:ring-primary focus:ring-offset-0"
                        disabled={isSubmitting}
                      />
                      <span className="text-sm text-gray-300 leading-relaxed">
                        {reason}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom reason input */}
              {selectedReason === "Other (please specify)" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-primary mb-2">
                    Please specify your reason:
                  </label>
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Enter your custom reason here..."
                    rows={3}
                    className="w-full bg-[#0d0d0d] border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-primary/60 resize-none text-sm"
                    disabled={isSubmitting}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {customReason.length}/500 characters
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Declining..." : "Decline Request"}
                </button>
              </div>
            </form>
          )}

          {/* Professional note */}
          <div className="mt-4 p-3 bg-[#0d0d0d] rounded-lg border border-primary/20">
            <p className="text-xs text-gray-400 leading-relaxed">
              <span className="text-primary font-medium">Note:</span> The client
              will be notified of your decision. We recommend being honest and
              professional in your communication to maintain trust and help
              clients find suitable alternatives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeclineReasonsModal;
