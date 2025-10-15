import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Clock,
  User,
  CreditCard,
  Hash,
  StickyNote,
  Star,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";

export default function ReviewBookingsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const userjwt = localStorage.getItem("userjwt");

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`${apiUrl}/user/booking/order/${id}`, {
          headers: { Authorization: `Bearer ${userjwt}` },
        });
        setBooking(res.data.data); // ✅ store booking object only
      } catch (err) {
        console.error("Failed to fetch booking:", err);
        toast.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBooking();
  }, [apiUrl, id, userjwt]);

  const handleReviewSubmit = async () => {
    if (!rating) {
      toast.error("Please select a star rating");
      return;
    }

    try {
      await axios.put(
        `${apiUrl}/user/booking/${booking._id}/review`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${userjwt}` } }
      );

      toast.success("Review submitted!");
      navigate('/user/userprofile')
      setComment("");
      setRating(0);
    } catch (err) {
      console.error("Review submit error:", err);
      toast.error("Failed to submit review");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        Loading booking details...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-red-400">
        Booking not found.
      </div>
    );
  }

  return (
    <div className="bg-[#0d0d0d] min-h-screen text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg bg-[#111] border border-white/10 hover:bg-[#222] transition"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-2xl font-bold text-primary">Booking Details</h1>
      </div>

      <div className="bg-[#111] rounded-2xl border border-primary/30 shadow-lg p-6 max-w-3xl mx-auto space-y-6">
        {/* Therapist Card */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-4">
          <img
            src={booking?.therapistId?.userId?.avatar_url}
            alt="Therapist Avatar"
            className="w-14 h-14 rounded-full border-2 border-primary object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold text-primary">
              {booking?.therapistId?.userId?.name?.first}{" "}
              {booking?.therapistId?.userId?.name?.last}
            </h2>
            <p className="text-sm text-gray-400">
              {booking?.therapistId?.userId?.email}
            </p>
            <p className="text-xs text-gray-500">
              {booking?.therapistId?.userId?.phone}
            </p>
          </div>
        </div>

        {/* Service + Status */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary">
            {booking?.serviceId?.name || "Custom Service"}
          </h2>
          <span
            className={`px-3 py-1 text-xs rounded-full font-medium ${booking.paymentStatus === "paid"
              ? "bg-green-500/20 text-green-400"
              : "bg-yellow-500/20 text-yellow-400"
              }`}
          >
            {booking.paymentStatus}
          </span>
        </div>

        {/* Info Grid */}
        <div className="space-y-3 text-sm text-gray-300">
          <p className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Therapist: {booking?.therapistId?.title}
          </p>

          <p className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            {new Date(booking.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>

          <p className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            {new Date(booking.slotStart).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {new Date(booking.slotEnd).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <p className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            {booking?.price?.amount ?? "N/A"} GBP
          </p>

          {booking.notes && (
            <p className="flex items-start gap-2 text-gray-400">
              <StickyNote className="w-4 h-4 text-primary mt-0.5" />
              {booking.notes}
            </p>
          )}

          {booking.bookingCode && (
            <p className="flex items-center gap-2 text-gray-500 text-xs">
              <Hash className="w-4 h-4 text-primary" />
              {booking.bookingCode}
            </p>
          )}
        </div>

        {/* Review Section */}
        <div className="border-t border-white/10 pt-6">
          <h3 className="text-lg font-semibold text-primary mb-3">
            Review Therapist
          </h3>

          {/* Stars */}
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-8 h-8 cursor-pointer transition ${s <= rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-500"
                  }`}
                onClick={() => setRating(s)}
              />
            ))}
          </div>

          {/* Comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Leave a comment (optional)"
            className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-primary"
            rows="3"
          />

          {/* Submit */}
          <button
            onClick={handleReviewSubmit}
            className="mt-4 px-4 py-2 rounded-lg bg-primary text-black font-semibold hover:opacity-90"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}
