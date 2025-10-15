import React from "react";
import {
  Star,
  Calendar,
  Clock,
  User,
  Briefcase,
  CreditCard,
  MessageSquare,
} from "lucide-react";

const BookingDetailsModal = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })} • ${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating
              ? "fill-primary text-primary"
              : "fill-gray-700 text-gray-700"
            }`}
        />
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/60 p-4">
      <div className="bg-[#0d0d0d] border border-primary/20 rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-5 border-b border-primary/10">
          <div>
            <h2 className="text-lg font-semibold text-white">Booking Details</h2>
            <p className="text-gray-500 text-xs mt-0.5">ID: {booking._id}</p>

            {/* 👇 Added Updated At */}
            {booking.updatedAt && (
              <p className="text-gray-500 text-xs mt-1 italic">
                Last updated: {formatDateTime(booking.updatedAt)}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#111] text-gray-400 hover:text-white transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Status Row */}
          <div className="flex gap-2 text-sm">
            <span className="px-3 py-1 rounded bg-[#111] text-gray-300 border border-primary/10 capitalize">
              {booking.status}
            </span>
            <span className="px-3 py-1 rounded bg-[#111] text-gray-300 border border-primary/10 capitalize">
              {booking.paymentStatus}
            </span>
            {booking.paymentMode && (
              <span className="px-3 py-1 rounded bg-[#111] text-gray-300 border border-primary/10 capitalize">
                {booking.paymentMode}
              </span>
            )}
          </div>

          {/* Client & Therapist */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111] rounded p-3 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-primary" />
                <p className="text-xs text-gray-500 uppercase">Client</p>
              </div>
              <p className="text-white font-medium">
                {booking.clientId?.name?.first || "N/A"}{" "}
                {booking.clientId?.name?.last || ""}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {booking.clientId?.email || ""}
              </p>
            </div>

            <div className="bg-[#111] rounded p-3 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-primary" />
                <p className="text-xs text-gray-500 uppercase">Therapist</p>
              </div>
              <p className="text-white font-medium">
                {booking.therapistId?.title || "N/A"}
              </p>
            </div>
          </div>

          {/* Service & Price */}
          <div className="bg-[#111] rounded p-4 border border-primary/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Service</p>
                <p className="text-white font-medium">
                  {booking.serviceId?.name || "N/A"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase mb-1">Price</p>
                <p className="text-primary font-semibold text-lg">
                  ${booking.price?.amount || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111] rounded p-3 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-primary" />
                <p className="text-xs text-gray-500 uppercase">Date</p>
              </div>
              <p className="text-white text-sm">{formatDate(booking.date)}</p>
            </div>

            <div className="bg-[#111] rounded p-3 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-primary" />
                <p className="text-xs text-gray-500 uppercase">Time</p>
              </div>
              <p className="text-white text-sm">
                {formatTime(booking.slotStart)} - {formatTime(booking.slotEnd)}
              </p>
            </div>
          </div>

          {/* Review Section */}
          {booking.isReviewed && booking.review && (
            <div className="bg-[#111] rounded p-4 border border-primary/10">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-primary" />
                <p className="text-xs text-gray-500 uppercase">Review</p>
              </div>

              <div className="flex items-center gap-3 mb-2">
                {renderStars(booking.review.rating)}
                <span className="text-white text-sm font-medium">
                  {booking.review.rating}/5
                </span>
              </div>

              {booking.review.Comment && (
                <p className="text-gray-300 text-sm leading-relaxed">
                  "{booking.review.Comment}"
                </p>
              )}
            </div>
          )}

          {/* Payment Details */}
          <div className="bg-[#111] rounded p-3 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <p className="text-xs text-gray-500 uppercase">Payment</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Mode</p>
                <p className="text-white capitalize">
                  {booking.paymentMode || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-primary/10">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded bg-[#111] text-white hover:bg-primary/10 border border-primary/20 hover:border-primary/40 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
