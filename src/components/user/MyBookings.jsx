import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  User,
  CreditCard,
  Hash,
  StickyNote,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const userId = localStorage.getItem("userId");
  const userjwt = localStorage.getItem("userjwt");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${apiUrl}/user/${userId}/bookings`, {
          headers: { Authorization: `Bearer ${userjwt}` },
        });
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    if (userId && userjwt) {
      fetchBookings();
    } else {
      setError("User not authenticated.");
      setLoading(false);
    }
  }, [apiUrl, userId, userjwt]);

  const filteredBookings = bookings.filter((b) => {
    const now = new Date();
    const bookingTime = new Date(b.slotStart);

    if (filter === "upcoming") {
      return (b.status === "pending" || b.status === "confirmed") && bookingTime > now;
    } else if (filter !== "all" && b.status !== filter) {
      return false;
    }

    if (search) {
      const searchLower = search.toLowerCase();
      const serviceName = b.serviceId?.name?.toLowerCase() || "";
      const therapistName = b.therapistId?.title?.toLowerCase() || "";
      if (!serviceName.includes(searchLower) && !therapistName.includes(searchLower)) {
        return false;
      }
    }

    return true;
  });

  const handleReview = (bookingId) => {
    navigate(`/user/reviewbooking/${bookingId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-primary">
        Loading bookings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col">
      {/* Top Navbar */}
      <header className="flex justify-between items-center bg-[#111] p-4 border-b border-primary/20">
        <h1 className="text-xl font-bold text-primary">My Bookings</h1>
      </header>

      {/* Filters + Search */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 py-3 bg-[#0f0f0f] border-b border-primary/20">
        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {["all", "upcoming", "completed", "declined"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1 rounded-lg font-medium capitalize ${filter === tab
                ? "bg-primary text-black"
                : "bg-[#1a1a1a] text-gray-400 hover:text-white"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search services or therapists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-primary/60"
          />
        </div>
      </div>

      {/* Bookings Content */}
      <main className="flex-1 p-6">
        {filteredBookings.length === 0 ? (
          <div className="flex justify-center items-center min-h-[400px] text-gray-400 text-center">
            {filter === "upcoming"
              ? "No upcoming bookings found."
              : search
                ? `No bookings found matching "${search}".`
                : "No bookings found."}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBookings.map((booking) => {
              const therapist = booking.therapistId;
              const service = booking.serviceId;
              const now = new Date();
              const bookingTime = new Date(booking.slotStart);
              const isPast = bookingTime < now;

              return (
                <div
                  key={booking._id}
                  className="bg-gradient-to-br from-[#111] to-[#1a1a1a] rounded-2xl shadow-xl border border-primary/30 hover:border-primary/60 transition transform hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="p-6 flex flex-col h-full justify-between">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-lg font-semibold text-primary tracking-wide">
                        {service ? service.name : "Custom Session"}
                      </h2>

                      <div className="flex flex-col items-end gap-1">
                        <div className="inline-flex">
                          <h1 className="mr-2 text-primary font-bold">Payment </h1>
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${booking.paymentStatus === "paid"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                              }`}
                          >
                            {booking.paymentStatus}
                          </span>
                        </div>
                        <div className="inline-flex">
                          <h1 className="mr-2 text-primary font-bold">Slot </h1>

                          <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${booking.status === "completed"
                              ? "bg-green-500/20 text-green-400"
                              : booking.status === "declined" || booking.status === "cancelled"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                              }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-3 text-sm text-gray-300">
                      {therapist ? (
                        <p className="flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-primary">Therapist:</span>
                          {therapist.title}
                        </p>
                      ) : (
                        <p className="flex items-center gap-2 italic text-gray-400">
                          <User className="w-4 h-4 text-gray-500" />
                          Therapist Not Assigned
                        </p>
                      )}

                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-primary">Service Date:</span>
                        {new Date(booking.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>

                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-primary">Payment Mode</span>{" "}
                        {booking?.paymentMode}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-primary">Service Time:</span>{" "}
                        {booking.slotStart?.slice(11, 16)} - {booking.slotEnd?.slice(11, 16)}
                      </p>

                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-primary">Booked At:</span>
                        {new Date(booking.createdAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>

                      <p className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-primary" />
                        <span className="font-semibold text-primary">Price:</span>
                        £{booking.price?.amount ?? booking.price}{" "}
                        {booking.price?.currency?.toUpperCase()}
                      </p>

                      {booking.notes && (
                        <p className="flex items-start gap-2 text-gray-400">
                          <StickyNote className="w-4 h-4 text-primary mt-0.5" />
                          <span className="font-semibold text-primary">Notes:</span>
                          {booking.notes}
                        </p>
                      )}

                      {booking._id && (
                        <p className="flex items-center gap-2 text-gray-500 text-xs">
                          <Hash className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-primary">Booking Id</span>

                          {booking._id}
                        </p>
                      )}
                    </div>

                    {/* Review Button */}
                    {!booking.isReviewed &&
                      therapist &&
                      booking.status === "completed" && (
                        <button
                          onClick={() => handleReview(booking._id)}
                          className="mt-4 w-full flex items-center justify-center gap-2 bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30 transition rounded-lg px-3 py-2 text-sm font-medium"
                        >
                          <Star className="w-4 h-4" />
                          Review Therapist
                        </button>
                      )}

                    {/* Review Display */}
                    {booking.isReviewed && booking.review && (
                      <div className="mt-4 border-t border-[#222] pt-3">
                        <h3 className="text-sm font-semibold text-primary mb-2">
                          Your Review
                        </h3>
                        <div className="flex items-center gap-2 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-4 w-4 ${star <= booking.review.rating
                                ? "text-yellow-400"
                                : "text-gray-600"
                                }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.382 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.382-2.46a1 1 0 00-1.176 0l-3.382 2.46c-.785.57-1.84-.197-1.54-1.118l1.286-3.966a1 1 0 00-.364-1.118l-3.382-2.46c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-gray-300 text-sm italic">
                          "{booking.review.Comment}"
                        </p>
                      </div>
                    )}
                    <a
                      href="/pdfs/noira_massage_setup_updated.pdf"
                      download
                      className="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-black font-semibold px-4 py-2 rounded-lg hover:bg-amber-500 transition"
                    >
                      Download Setup Guide
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
