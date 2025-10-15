import React, { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const EditBookingModal = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null;

  console.log("This is the booking: ", booking);
  const apiUrl = import.meta.env.VITE_API_URL;
  const adminjwt = localStorage.getItem("adminjwt");

  const [selectedDate, setSelectedDate] = useState(booking.slotStart.slice(0, 10));
  const [selectedHour, setSelectedHour] = useState(booking.slotStart.slice(11, 13));
  const [selectedMinute, setSelectedMinute] = useState(booking.slotStart.slice(14, 16));

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = ["00", "15", "30", "45"];

  // Therapist input state
  const [therapistQuery, setTherapistQuery] = useState(booking.therapistId?.title || "");
  const [therapistSuggestions, setTherapistSuggestions] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState({
    id: booking.therapistId?._id || null,
    name: booking.therapistId?.title || "",
  });
  const [hasEditedTherapist, setHasEditedTherapist] = useState(false);

  const handleTherapistInputChange = (e) => {
    const value = e.target.value;
    setTherapistQuery(value);
    setSelectedTherapist({ id: null, name: value });
    setHasEditedTherapist(true);

    if (value.trim() === "") {
      setTherapistSuggestions([]);
      return;
    }

    // Debounce API call
    clearTimeout(window.therapistTimeout);
    window.therapistTimeout = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/therapist/getalltherapistsnames?q=${value}`
        );
        if (res.data.success) {
          setTherapistSuggestions(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching therapists:", err);
      }
    }, 300);
  };

  // Fetch therapist suggestions only when user has edited the field
  useEffect(() => {
    if (!hasEditedTherapist || therapistQuery.trim() === "") {
      setTherapistSuggestions([]);
      return;
    }

    const fetchTherapists = async () => {
      try {
        const res = await axios.get(
          `${apiUrl}/therapist/getalltherapistsnames?q=${therapistQuery}`
        );
        if (res.data.success) {
          setTherapistSuggestions(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching therapists:", err);
      }
    };

    const timeoutId = setTimeout(fetchTherapists, 300); // debounce 300ms
    return () => clearTimeout(timeoutId);
  }, [therapistQuery, hasEditedTherapist]);

  const handleUpdateBooking = async () => {
    if (!selectedTherapist.id) {
      toast.error("Please select a therapist from suggestions.");
      return;
    }

    try {
      const newSlotStart = `${selectedDate}T${selectedHour}:${selectedMinute}:00.000Z`;
      const endHours = (parseInt(selectedHour) + 1) % 24;
      const newSlotEnd = `${selectedDate}T${String(endHours).padStart(2, "0")}:${selectedMinute}:00.000Z`;

      const res = await fetch(`${apiUrl}/admin/booking/reschedule/${booking._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminjwt}`,
        },
        body: JSON.stringify({
          slotStart: newSlotStart,
          slotEnd: newSlotEnd,
          therapistId: selectedTherapist.id, // send selected therapist id
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Booking updated successfully!");
        onClose(true);
      } else {
        throw new Error(data.message || "Failed to update booking");
      }
    } catch (err) {
      console.error("Error updating booking:", err);
      toast.error(err.message || "Failed to update booking");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/20 rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-400" />
          Edit Booking
        </h2>

        {/* Therapist Input */}
        <div className="mb-6 relative">
          <label className="block text-gray-300 text-sm font-medium mb-3">
            Therapist
          </label>
          <input
            type="text"
            value={therapistQuery}
            onChange={handleTherapistInputChange}
            placeholder="Type therapist name"
            className="w-full px-4 py-3 bg-[#111] text-white rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          {therapistSuggestions.length > 0 && (
            <ul className="absolute z-50 w-full bg-[#111] border border-gray-700 mt-1 rounded-xl max-h-48 overflow-y-auto">
              {therapistSuggestions.map((therapist) => (
                <li
                  key={therapist.id}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-500/20 text-white"
                  onClick={() => {
                    setSelectedTherapist(therapist);
                    setTherapistQuery(therapist.name);
                    setTherapistSuggestions([]);
                    setHasEditedTherapist(false);
                  }}
                >
                  {therapist.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Date Selection */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-medium mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-3 bg-[#111] text-white rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Time Selection */}
        <div className="mb-8">
          <label className="block text-gray-300 text-sm font-medium mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Select Time (24-hour format)
          </label>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-gray-400 text-xs mb-2">Hour</label>
              <select
                value={selectedHour}
                onChange={(e) => setSelectedHour(e.target.value)}
                className="w-full px-4 py-3 bg-[#111] text-white rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
              >
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end pb-3 text-gray-400 text-2xl font-bold">:</div>

            <div className="flex-1">
              <label className="block text-gray-400 text-xs mb-2">Minute</label>
              <select
                value={selectedMinute}
                onChange={(e) => setSelectedMinute(e.target.value)}
                className="w-full px-4 py-3 bg-[#111] text-white rounded-xl border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
              >
                {minutes.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Preview */}
          <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-400 text-sm text-center font-medium">
              Selected: {selectedDate} at {selectedHour}:{selectedMinute}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onClose(false)}
            className="flex-1 px-6 py-3 rounded-xl bg-gray-700/50 text-white hover:bg-gray-600/50 transition-all font-medium border border-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateBooking}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all font-medium shadow-lg shadow-blue-500/30"
          >
            Update Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBookingModal;
