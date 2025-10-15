import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import DeclineReasonsModal from './DeclineReasonsModal.jsx';

export default function TherapistBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [statusLoading, setStatusLoading] = useState(null);
  const [bookedAtTime, setBookedAtTime] = useState('');
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL;
  const therapistjwt = localStorage.getItem("therapistjwt");

  const formatToShortMonth = (dateString) => {
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate)) {
      throw new Error("Invalid date format");
    }
    const options = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    setBookedAtTime(parsedDate.toLocaleString('en-US', options));
  }

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${baseUrl}/therapist/getbookings`, {
          headers: { Authorization: `Bearer ${therapistjwt}` },
        });
        setBookings(res.data.bookings || []);
      } catch (err) {
        toast.error("Failed to fetch bookings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [baseUrl, therapistjwt]);

  // Handle decline with reason
  const handleDeclineWithReason = async (bookingId, reason) => {
    try {
      setStatusLoading(bookingId);

      await axios.put(
        `${baseUrl}/therapist/decline/${bookingId}`,
        { reason },
        { headers: { Authorization: `Bearer ${therapistjwt}` } }
      );

      toast.success("Booking declined successfully");

      // Update local state
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "declined" } : b))
      );
    } catch (err) {
      toast.error("Failed to decline booking");
      console.error(err);
      throw err;
    } finally {
      setStatusLoading(null);
    }
  };

  // Handle decline button click
  const handleDeclineClick = (booking) => {
    setSelectedBooking(booking);
    setIsDeclineModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsDeclineModalOpen(false);
    setSelectedBooking(null);
  };

  // Mark as completed
  const updateBookingStatus = async (id, status) => {
    try {
      setStatusLoading(id);

      const endpoint = `${baseUrl}/therapist/completebooking/${id}`;

      await axios.put(
        endpoint,
        {},
        { headers: { Authorization: `Bearer ${therapistjwt}` } }
      );

      toast.success(`Booking marked as ${status}`);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b))
      );
    } catch (err) {
      toast.error("Action failed");
      console.error(err);
    } finally {
      setStatusLoading(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const now = new Date();
    const bookingTime = new Date(b.slotStart);

    // Filter logic
    if (filter === "upcoming") {
      return b.status === "confirmed" && bookingTime > now;
    } else if (filter !== "all" && b.status !== filter) {
      return false;
    }

    // Search filter
    if (
      search &&
      !b.serviceId?.name?.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-primary">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col">
      {/* Top Navbar */}
      <header className="flex justify-between items-center bg-[#111] p-4 border-b border-primary/20">
        <h1 className="text-xl font-bold text-primary">My Bookings</h1>
      </header>

      {/* Filters */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0f0f0f] border-b border-primary/20">
        <div className="flex gap-3">
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
      </div>

      {/* Booking Cards */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredBookings.length === 0 ? (
          <p className="text-gray-500">
            {filter === "upcoming" ? "No upcoming bookings found." : "No bookings found."}
          </p>
        ) : (
          filteredBookings.map((b) => {
            const now = new Date();
            const bookingTime = new Date(b.slotStart);
            const isPast = bookingTime < now;

            return (
              <div
                key={b._id}
                className="bg-[#111] rounded-2xl p-5 border border-primary/20 shadow-lg"
              >
                {/* Service Name + Code */}
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">{b.serviceId?.name}</h2>
                  <span className="text-xs text-yellow-400 font-medium">
                    #{b._id || b._id.slice(-6).toUpperCase()}
                  </span>
                </div>

                {/* Client + Details */}
                <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-300 mb-4">
                  <p>
                    <span className="text-primary font-medium">Client:</span>{" "}
                    {b.clientId?.name?.first} {b.clientId?.name?.last}
                  </p>
                  <p>
                    <span className="text-primary font-medium">Service Date:</span>{" "}
                    {b.date.split("T")[0]}
                    {/* {new Date(b.slotStart).toLocaleTimeString([], { */}
                    {/*   hour: "2-digit", */}
                    {/*   minute: "2-digit", */}
                    {/*   hour12: true, */}
                    {/* })} */}
                  </p>
                  <p>
                    <span className="text-primary font-medium">Service Time:</span>{" "}
                    {b.slotStart.slice(11, 16)}
                  </p>
                  <p>
                    <span className="text-primary font-medium">Duration:</span>{" "}
                    {Math.round(
                      (new Date(b.slotEnd) - new Date(b.slotStart)) / 60000
                    )}{" "}
                    min
                  </p>
                  <p>
                    <span className="text-primary font-medium">Price: £</span>
                    {b.price?.amount} {b.price?.currency}
                  </p>
                  <p className="col-span-2">
                    <span className="text-primary font-medium">Booked At:</span>{" "}
                    {new Date(b.createdAt).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>

                {/* Status + Actions */}
                <div className="flex justify-between items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${b.status === "completed"
                      ? "bg-green-500/20 text-green-400"
                      : b.status === "declined" || b.status === "cancelled"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                      }`}
                  >
                    {b.status}
                  </span>

                  {/* Action Buttons */}
                  {b.status !== "completed" && b.status !== "declined" && (
                    <div className="flex gap-2">
                      {isPast ? (
                        <button
                          onClick={() => updateBookingStatus(b._id, "completed")}
                          disabled={statusLoading === b._id}
                          className="bg-primary hover:bg-yellow-600 text-black px-3 py-1 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {statusLoading === b._id
                            ? "Updating..."
                            : "Mark Completed"}
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleDeclineClick(b)}
                            disabled={statusLoading === b._id}
                            className="bg-red-600 hover:bg-red-700 inline-flex justify-center items-center text-white px-3 py-1 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {statusLoading === b._id ? (
                              "Declining..."
                            ) : (
                              <>
                                <FaTimes className="mr-1" /> Decline
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => updateBookingStatus(b._id, "completed")}
                            disabled={statusLoading === b._id}
                            className="bg-primary hover:bg-yellow-600 text-black px-3 py-1 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {statusLoading === b._id
                              ? "Updating..."
                              : "Mark Completed"}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Review Section */}
                {b.isReviewed && b.review && (
                  <div className="mt-4 border-t border-[#222] pt-3">
                    <h3 className="text-sm font-semibold text-primary mb-2">
                      Client Review
                    </h3>
                    <div className="flex items-center gap-2 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 ${star <= b.review.rating
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
                      "{b.review.Comment}"
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>

      {/* Decline Reasons Modal */}
      <DeclineReasonsModal
        isOpen={isDeclineModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleDeclineWithReason}
        bookingId={selectedBooking?._id}
        clientName={`${selectedBooking?.clientId?.name?.first || ''} ${selectedBooking?.clientId?.name?.last || ''}`.trim()}
      />
    </div>
  );
}
