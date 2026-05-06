import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import ConfirmLogoutModal from "../adminDashboard/ConfirmLogOutModal";

const ScheduleManagement = () => {
  const [availability, setAvailability] = useState([]);
  const therapistId = localStorage.getItem("therapistId");
  const therapistjwt = localStorage.getItem("therapistjwt");

  const apiUrl = import.meta.env.VITE_API_URL; // ✅ get from env

  // Fetch availability data
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await axios.post(`${apiUrl}/therapist/next7days`, {
          therapistId,
        }, {
          headers: {
            Authorization: `Bearer ${therapistjwt}`,

          }
        });
        setAvailability(res.data.availability || []);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAvailability();
  }, [apiUrl, therapistId]);

  // Format date -> weekday
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  return (
    <div className="bg-[#111] rounded-2xl border border-white/10 p-6 shadow-md w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-white">
          This Week&apos;s Availability
        </h2>
        <Link
          to="/therapist/therapistschedule"
          className="bg-yellow-400 cursor-pointer hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
        >
          <Plus size={18} /> Add Availability
        </Link>
      </div>

      {/* Availability Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availability.map((day, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow flex flex-col ${day.isAvailable
              ? "bg-green-950 text-green-400"
              : "bg-red-950 text-red-400"
              }`}
          >
            <span className="font-medium">{getDayName(day.date)}</span>
            <div className="mt-1">
              {day.blocks && day.blocks.length > 0 ? (
                day.blocks.map((block, i) => (
                  <div key={i} className="text-yellow-200 text-sm">
                    {block.startTime} - {block.endTime}
                  </div>
                ))
              ) : (
                <span className="text-yellow-200 text-sm">Unavailable</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleManagement;
