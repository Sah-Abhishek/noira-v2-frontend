import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { format } from "date-fns";

const CancelBookingModal = ({ isOpen, onClose, booking }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const adminjwt = localStorage.getItem("adminjwt"); // assuming user jwt is stored here
  // console.log("This is the booking: ", booking);


  const handleCancelBooking = async () => {
    if (!booking?._id) {
      toast.error("Invalid booking");
      return;
    }

    try {
      const res = await axios.put(`${apiUrl}/admin/booking/cancel/${booking._id}`, {}, {
        headers: {
          Authorization: `Bearer ${adminjwt}`,
        },
      });

      if (res.status === 200) {
        toast.success("Booking cancelled successfully");
        onClose(true); // notify parent with success
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-[#0d0d0d]/95 border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-lg transform transition-all duration-300 scale-100">
        <h2 className="text-xl font-bold text-white mb-4">Cancel Booking</h2>

        {/* Booking Details */}
        <div className="mb-6 space-y-3 text-gray-300">
          <p>
            <span className="font-semibold text-white">Booking ID:</span>{" "}
            {booking._id}
          </p>
          <p>
            <span className="font-semibold text-white">Customer:</span>{" "}
            {booking?.clientId?.name?.first} {booking?.clientId?.name?.last} (
            {booking?.clientId?.email})
          </p>
          <p>
            <span className="font-semibold text-white">Therapist:</span>{" "}
            {booking?.therapistId?.title}
          </p>
          <p>
            <span className="font-semibold text-white">Service:</span>{" "}
            {booking?.serviceId?.name}
          </p>
          <p>
            <span className="font-semibold text-white">Date & Time:</span>{" "}
            {format(new Date(booking.slotStart), "dd MMM yyyy, hh:mm a")} -{" "}
            {format(new Date(booking.slotEnd), "hh:mm a")}
          </p>
          <p>
            <span className="font-semibold text-white">Price:</span> £
            {booking?.price?.amount}
          </p>
          <p>
            <span className="font-semibold text-white">Payment Status:</span>{" "}
            {booking.paymentStatus}
          </p>
        </div>

        <p className="text-xs text-gray-500 mb-6">
          Are you sure you want to cancel this booking? This action cannot be undone.
        </p>

        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => onClose(false)}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
          >
            Keep Booking
          </button>
          <button
            onClick={handleCancelBooking}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;
