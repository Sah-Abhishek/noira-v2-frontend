
// components/BookingRequests.jsx
import React from "react";

const BookingRequests = () => {
  const requests = [
    {
      id: 1,
      name: "Michael Chen",
      service: "Deep Tissue Massage",
      date: "Dec 16, 2024 · 2:00 PM",
      status: "Pending",
      duration: "60 minutes",
      price: "$85",
      avatar: "https://i.pravatar.cc/40?img=12",
      isActionable: true,
    },
    {
      id: 2,
      name: "Emma Wilson",
      service: "Swedish Massage",
      date: "Dec 17, 2024 · 10:00 AM",
      status: "Confirmed",
      duration: "90 minutes",
      price: "$120",
      avatar: "https://i.pravatar.cc/40?img=47",
      isActionable: false,
    },
  ];

  return (
    <div className="bg-[#111111] rounded-2xl p-5 shadow-lg text-white">
      <h2 className="text-lg font-semibold mb-4">Booking Requests</h2>
      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-[#1c2635] p-4 rounded-xl flex flex-col gap-3"
          >
            {/* Top Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={req.avatar}
                  alt={req.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold">{req.name}</p>
                  <p className="text-sm text-gray-400">{req.service}</p>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${req.status === "Pending"
                  ? "bg-yellow-800 text-yellow-300"
                  : "bg-green-900 text-green-400"
                  }`}
              >
                {req.status}
              </span>
            </div>

            {/* Date & Duration */}
            <div className="flex justify-between">
              <p className="text-sm text-gray-400">{req.date}</p>
              <p className="text-sm text-gray-400">
                {req.duration} · {req.price}
              </p>

            </div>

            {/* Action Buttons */}
            {req.isActionable && (
              <div className="flex gap-3">
                <button className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg font-medium">
                  ✓ Accept
                </button>
                <button className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-medium">
                  ✕ Decline
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingRequests;
