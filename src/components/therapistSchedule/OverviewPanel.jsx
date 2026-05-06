import React, { useState } from "react";
import { FaEdit, FaTimes } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import DeleteSlotModal from "./DeleteSlotModal"; // ✅ fix typo in import

export default function OverviewPanel({
  availabilityData,
  availableDays,
  totalHours,
  openModal,
  setAvailabilityData,
}) {
  const therapistId = localStorage.getItem("therapistId");
  const apiUrl = import.meta.env.VITE_API_URL;

  const [modalOpen, setModalOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(null); // {dateKey, index}
  const therapistjwt = localStorage.getItem("therapistjwt");

  const handleDeleteClick = (dateKey, index) => {
    setSlotToDelete({ dateKey, index });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSlotToDelete(null);
  };

  const confirmDelete = async () => {
    if (!slotToDelete) return;
    const { dateKey, index } = slotToDelete;
    const slot = availabilityData[dateKey][index];

    try {
      await axios.post(
        `${apiUrl}/therapist/blocks`,
        {
          therapistId,
          date: new Date(dateKey).toISOString(),
          blocksToDelete: [
            {
              startTime: slot.start,
              endTime: slot.end,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${therapistjwt}`,
          },
        }
      );

      toast.success("Slot deleted successfully");

      // Update local state
      setAvailabilityData((prev) => {
        const newSlots = [...prev[dateKey]];
        newSlots.splice(index, 1);

        if (!newSlots.length) {
          const { [dateKey]: _, ...rest } = prev;
          return rest;
        }

        return {
          ...prev,
          [dateKey]: newSlots,
        };
      });
    } catch (error) {
      console.error("Error deleting slot:", error);
      toast.error("Failed to delete slot. Please try again.");
    } finally {
      closeModal();
    }
  };

  // 🗓️ filter out past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAvailability = Object.entries(availabilityData).filter(
    ([dateKey]) => {
      const [y, m, d] = dateKey.split("-");
      const date = new Date(y, m - 1, d);
      return date >= today; // ✅ only today and future
    }
  );

  // 📊 Summary data (use only upcoming)
  const totalSlots = upcomingAvailability.reduce(
    (acc, [, slots]) => acc + slots.length,
    0
  );

  const allUpcomingDates = upcomingAvailability
    .map(([dateKey]) => dateKey)
    .sort();

  const earliestDate = allUpcomingDates.length ? allUpcomingDates[0] : null;
  const latestDate = allUpcomingDates.length
    ? allUpcomingDates[allUpcomingDates.length - 1]
    : null;

  return (
    <div className="glass-morphism bg-[#0d0d0d] border border-white/10 rounded-2xl p-6 h-fit">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold font-playfair text-primary">
          Monthly Overview
        </h3>
      </div>

      {/* Summary Info */}
      <div className="mb-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Available Days</span>
          <span className="text-gold font-semibold">{availableDays}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Hours</span>
          <span className="text-gold font-semibold">
            {Number(totalHours).toFixed(2)}h
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Slots</span>
          <span className="text-gold font-semibold">{totalSlots}</span>
        </div>

        {earliestDate && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Earliest Availability</span>
            <span className="text-gold font-semibold">
              {new Date(earliestDate).toLocaleDateString()}
            </span>
          </div>
        )}

        {latestDate && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Latest Availability</span>
            <span className="text-gold font-semibold">
              {new Date(latestDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Slots List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {upcomingAvailability.length === 0 ? (
          <div className="text-gray-400 text-sm text-center py-8">
            No upcoming availability set
          </div>
        ) : (
          upcomingAvailability.map(([dateKey, slots]) => {
            const [y, m, d] = dateKey.split("-");
            const date = new Date(y, m - 1, d);
            const dayName = date.toLocaleDateString("en-US", {
              weekday: "short",
            });
            return (
              <div
                key={dateKey}
                className="glass-morphism p-3 rounded-lg border border-gray-700 hover:border-gold transition-colors"
              >
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gold font-medium">
                    {dayName}, {m}/{d}
                  </span>
                  <button
                    onClick={() => openModal(dateKey)}
                    className="text-gray-400 hover:text-gold"
                  >
                    <FaEdit className="text-xs" />
                  </button>
                </div>
                <div className="space-y-1">
                  {slots.map((s, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span>
                        {s.start} - {s.end}
                      </span>
                      <button
                        onClick={() => handleDeleteClick(dateKey, i)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirm Delete Modal */}
      <DeleteSlotModal
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
