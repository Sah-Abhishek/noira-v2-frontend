import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCalendarAlt, FaSave, FaTrash, FaSync } from "react-icons/fa";
import CalendarComponent from "../components/therapistSchedule/CalendarComponent.jsx";
import OverviewPanel from "../components/therapistSchedule/OverviewPanel.jsx";
import ScheduleModal from "../components/therapistSchedule/ScheduleModal.jsx";
import ResetConfirmModal from "../components/therapistSchedule/ResetConfirmModal.jsx";
import toast from "react-hot-toast";

export default function TherapistSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availabilityData, setAvailabilityData] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const therapistjwt = localStorage.getItem('therapistjwt');
  const apiUrl = import.meta.env.VITE_API_URL;
  const therapistId = localStorage.getItem("therapistId");
  // console.log("This is the value of isModalOpen: ", isResetModalOpen);

  // ✅ Make it reusable
  const refreshAvailability = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${apiUrl}/therapist/availability/${therapistId}`
        , {
          headers: {
            Authorization: `Bearer ${therapistjwt}`,
          },
        });

      // Transform API response into { "YYYY-MM-DD": [ { start, end } ] }
      const formattedData = {};
      res.data.availability.forEach((entry) => {
        const dateKey = entry.date.split("T")[0];
        formattedData[dateKey] = entry.blocks
          .filter((block) => block.isAvailable)
          .map((block) => ({
            start: block.startTime,
            end: block.endTime,
          }));
      });

      setAvailabilityData(formattedData);
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setLoading(false);
    }
  };

  // Run on mount
  useEffect(() => {
    refreshAvailability();
  }, []);

  const resetMonth = async () => {
    try {
      setLoading(true);
      const month = currentDate.getMonth() + 1; // 1–12
      const year = currentDate.getFullYear();

      const response = await axios.post(`${apiUrl}/therapist/reset`, {
        therapistId,
        month,
        year,
      }, {
        headers: {
          Authorization: `Bearer ${therapistjwt}`,
        },
      });

      if (response.status === 200) {
        toast.success(`Availability for ${month}/${year} has been cleared.`);
        setIsResetModalOpen(false);
        refreshAvailability();
      } else {
        toast.error("Failed to reset availability.");
      }
    } catch (error) {
      console.error("Error resetting month:", error);
      toast.error("An error occurred while resetting availability.");
    } finally {
      setLoading(false);
    }
  };
  // Derived stats
  const availableDays = Object.keys(availabilityData).length;
  const totalHours = Object.values(availabilityData).reduce((total, slots) => {
    return (
      total +
      slots.reduce((sum, slot) => {
        if (!slot.start || !slot.end) return sum;
        const [sh, sm] = slot.start.split(":").map(Number);
        const [eh, em] = slot.end.split(":").map(Number);
        return sum + (eh * 60 + em - (sh * 60 + sm)) / 60;
      }, 0)
    );
  }, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading availability...
      </div>
    );
  }

  return (
    <div className="bg-black text-white font-sans min-h-screen p-4 lg:p-8">
      {/* Header */}
      <header className="glass-morphism border border-white/10 bg-[#0d0d0d] rounded-2xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center">
              <FaCalendarAlt className="text-black text-lg sm:text-xl" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-playfair font-bold text-primary">
                Advanced Availability Scheduler
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Manage your therapy sessions and availability
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => alert("Availability plan saved successfully!")}
              className="bg-primary px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm text-black font-semibold hover:opacity-90 transition-opacity"
            >
              <FaSave className="inline mr-1 sm:mr-2" />
              Save
            </button>

            <button
              onClick={refreshAvailability}
              className="glass-morphism px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border border-blue-400 text-xs sm:text-sm text-blue-400 hover:bg-blue-500 hover:bg-opacity-20 transition-all"
            >
              <FaSync className="inline mr-1 sm:mr-2" />
              Refresh
            </button>

            <button
              onClick={() => setIsResetModalOpen(true)}
              className="glass-morphism px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border border-red-400 text-xs sm:text-sm text-red-400 hover:bg-red-500 hover:bg-opacity-20 transition-all"
            >
              <FaTrash className="inline mr-1 sm:mr-2" />
              Reset
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <CalendarComponent
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            availabilityData={availabilityData}
            openModal={(day) => {
              setSelectedDay(day);
              setIsModalOpen(true);
            }}
          />
        </div>
        <div className="xl:col-span-1">
          <OverviewPanel
            availabilityData={availabilityData}
            availableDays={availableDays}
            totalHours={totalHours}
            openModal={(day) => {
              setSelectedDay(day);
              setIsModalOpen(true);
            }}
            setAvailabilityData={setAvailabilityData}
          />
        </div>
      </div>

      <ScheduleModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedDay={selectedDay}
        availabilityData={availabilityData}
        setAvailabilityData={setAvailabilityData}
        refreshAvailability={refreshAvailability} // ✅ pass down
      />
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={resetMonth}
      />
    </div>
  );
}
