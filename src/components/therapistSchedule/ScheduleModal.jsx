// src/components/ScheduleModal.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaSave, FaTrash, FaTimes, FaPlus } from "react-icons/fa";

export default function ScheduleModal({
  isModalOpen,
  setIsModalOpen,
  selectedDay,
  availabilityData,
  setAvailabilityData,
  refreshAvailability, // 🔑 passed from Calendar
}) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [copyType, setCopyType] = useState(null); // 👈 track if user chose a copy option
  const apiUrl = import.meta.env.VITE_API_URL;
  const therapistId = localStorage.getItem("therapistId");
  const [newSlots, setNewSlots] = useState([]);
  const therapistjwt = localStorage.getItem("therapistjwt");
  const [cleaDarLoading, setClearDayLoading] = useState(false);


  if (!isModalOpen) return null;

  // Generate hours for dropdown
  const generateHours = () => {
    const hours = [];
    for (let hour = 0; hour < 24; hour++) {
      const hourStr = hour.toString().padStart(2, "0");
      hours.push({ value: hourStr, label: hourStr }); // ✅ 24-hour format
    }
    return hours;
  };

  const hourOptions = generateHours();
  const minuteOptions = [
    { value: '00', label: ':00' },
    { value: '30', label: ':30' }
  ];

  // Parse time components
  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: '', minute: '' };
    const [hour, minute] = timeStr.split(':');
    return { hour, minute };
  };

  const formatTime = (hour, minute) => {
    if (!hour || !minute) return '';
    return `${hour}:${minute}`;
  };

  const startTimeParts = parseTime(startTime);
  const endTimeParts = parseTime(endTime);

  const handleSave = async () => {
    if (!availabilityData[selectedDay]) {
      toast.error("No slots to save");
      return;
    }

    const blocks = availabilityData[selectedDay].map((slot) => ({
      startTime: slot.start,
      endTime: slot.end,
      isAvailable: true,
    }));

    const payload = copyType
      ? {
        therapistId,
        baseDate: selectedDay, // for copy API
        blocks: blocks.map(({ startTime, endTime }) => ({ startTime, endTime })),
        copyType,
      }
      : {
        therapistId,
        date: selectedDay, // for normal save
        blocks,
      };

    try {
      setClearDayLoading(true);
      const endpoint = copyType
        ? `${apiUrl}/therapist/availability/copy`
        : `${apiUrl}/therapist/addAvailability`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${therapistjwt}`, // ✅ Add JWT here

        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // ❌ error case
        const errorText = await res.text();
        throw new Error(errorText || "Failed to save schedule");
      }

      // ✅ success case
      toast.success("Schedule saved successfully!");
      setIsModalOpen(false);
      setCopyType(null);
      refreshAvailability();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong while saving schedule");
    } finally {
      setClearDayLoading(false);
    }
  };

  const addSlot = () => {
    if (!startTime || !endTime || startTime >= endTime) {
      toast.error("Please enter a valid time slot");
      return;
    }

    setAvailabilityData((prev) => {
      const newDaySlots = prev[selectedDay] ? [...prev[selectedDay]] : [];

      // ✅ Check for overlaps
      const overlap = newDaySlots.some((slot) => {
        return (
          (startTime < slot.end && endTime > slot.start) // overlap condition
        );
      });

      if (overlap) {
        toast.error("This slot overlaps with an existing slot");
        return prev; // 🚫 don't add the slot
      }

      // ✅ Add only if no overlap
      newDaySlots.push({ start: startTime, end: endTime });
      newDaySlots.sort((a, b) => a.start.localeCompare(b.start));
      return { ...prev, [selectedDay]: newDaySlots };
    });

    setStartTime("");
    setEndTime("");
  };

  const removeSlot = (index) => {
    setAvailabilityData((prev) => {
      const newSlots = [...prev[selectedDay]];
      newSlots.splice(index, 1);
      if (!newSlots.length) {
        const { [selectedDay]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [selectedDay]: newSlots };
    });
  };

  const clearDay = async () => {
    try {

      setClearDayLoading(true);
      const res = await fetch(`${apiUrl}/therapist/date`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${therapistjwt}`
        },
        body: JSON.stringify({
          therapistId,
          date: selectedDay,
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);

      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to clear availability for this day");
      }

      toast.success(`Availability cleared for ${selectedDay}`);

      // ✅ Update UI locally
      setAvailabilityData((prev) => {
        const { [selectedDay]: _, ...rest } = prev;
        return rest;
      });

      refreshAvailability(); // 🔄 reload from backend for safety
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong while clearing the day");
    } finally {
      setClearDayLoading(false);
    }
  };

  // 👇 Copy options now just set the type, then user must press Save
  const copySchedule = (type) => {
    setCopyType(type);
    // alert(`Copy schedule mode selected: ${type}. Now click Save to confirm.`);
  };

  return (
    <div
      className="fixed inset-0 modal-backdrop backdrop-blur-lg z-50 flex items-center justify-center p-4"
      onClick={(e) =>
        e.target.classList.contains("modal-backdrop") &&
        setIsModalOpen(false)
      }
    >
      <div className="glass-morphism bg-[#0d0d0d] border-white/10 rounded-2xl p-6 w-full max-w-lg border border-gold max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between mb-6">
          <h3 className="text-xl font-semibold font-playfair">
            Manage Availability
          </h3>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        {/* Selected Day */}
        <div className="mb-6 gap-x-4">
          <h4 className="text-xl text-primary font-medium mb-4">
            {selectedDay}
          </h4>

          {/* Copy Schedule */}
          <div className="glass-morphism bg-[#111111] p-4 rounded-xl border border-white/10 mb-4">
            <h5 className="font-medium mb-3">Copy Schedule To:</h5>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => copySchedule("next7days")}
                className={`glass-morphism px-4 py-2 rounded-lg border ${copyType === "next7days"
                  ? "border-primary text-primary"
                  : "border-gray-600 text-gray-300"
                  }`}
              >
                Next 7 Days
              </button>
              <button
                onClick={() => copySchedule("allweekdays")}
                className={`glass-morphism px-4 py-2 rounded-lg border ${copyType === "allweekdays"
                  ? "border-primary text-primary"
                  : "border-gray-600 text-gray-300"
                  }`}
              >
                All Weekdays
              </button>
              <button
                onClick={() => copySchedule("allweekends")}
                className={`glass-morphism px-4 py-2 rounded-lg border ${copyType === "allweekends"
                  ? "border-primary text-primary"
                  : "border-gray-600 text-gray-300"
                  }`}
              >
                All Weekends
              </button>
              <button
                onClick={() => copySchedule("entiremonth")}
                className={`glass-morphism px-4 py-2 rounded-lg border ${copyType === "entiremonth"
                  ? "border-primary text-primary"
                  : "border-gray-600 text-gray-300"
                  }`}
              >
                Entire Month
              </button>
            </div>
          </div>

          {/* Time Slots List */}
          <div className="space-y-2 mb-4 rounded-lg">
            {availabilityData[selectedDay]?.length ? (
              availabilityData[selectedDay].map((slot, i) => (
                <div
                  key={i}
                  className="time-slot bg-primary/20 p-3 rounded-lg flex justify-between"
                >
                  <span>
                    {slot.start} - {slot.end}
                  </span>
                  <button
                    onClick={() => removeSlot(i)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-sm text-center py-4">
                No time slots set
              </div>
            )}
          </div>

          {/* Add Slot */}
          <div className="glass-morphism p-4 rounded-xl border border-white/10">
            <h5 className="font-medium mb-3">Add Time Slot</h5>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Start Time */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Start Time
                </label>
                <div className="flex gap-2">
                  <select
                    value={startTimeParts.hour}
                    onChange={(e) => setStartTime(formatTime(e.target.value, startTimeParts.minute || '00'))}
                    className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="">Hour</option>
                    {hourOptions.map((hour) => (
                      <option key={hour.value} value={hour.value}>
                        {hour.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={startTimeParts.minute}
                    onChange={(e) => setStartTime(formatTime(startTimeParts.hour || '00', e.target.value))}
                    className="w-20 bg-gray-800 border border-gray-600 rounded-lg px-2 py-2 text-white text-sm"
                  >
                    <option value="">Min</option>
                    {minuteOptions.map((minute) => (
                      <option key={minute.value} value={minute.value}>
                        {minute.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  End Time
                </label>
                <div className="flex gap-2">
                  <select
                    value={endTimeParts.hour}
                    onChange={(e) => setEndTime(formatTime(e.target.value, endTimeParts.minute || '00'))}
                    className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                  >
                    <option value="">Hour</option>
                    {hourOptions.map((hour) => (
                      <option key={hour.value} value={hour.value}>
                        {hour.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={endTimeParts.minute}
                    onChange={(e) => setEndTime(formatTime(endTimeParts.hour || '00', e.target.value))}
                    className="w-20 bg-gray-800 border border-gray-600 rounded-lg px-2 py-2 text-white text-sm"
                  >
                    <option value="">Min</option>
                    {minuteOptions.map((minute) => (
                      <option key={minute.value} value={minute.value}>
                        {minute.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <button
              onClick={addSlot}
              className="bg-primary hover:bg-amber-500 w-full py-2 rounded-lg text-black font-medium"
            >
              <FaPlus className="inline mr-2" /> Add Slot
            </button>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            disabled={
              cleaDarLoading ||
              !availabilityData[selectedDay] ||
              availabilityData[selectedDay].length === 0
            } // ✅ disable if no slots
            className={`flex-1 py-3 rounded-xl font-semibold transition-all
    ${cleaDarLoading ||
                !availabilityData[selectedDay] ||
                availabilityData[selectedDay].length === 0
                ? "bg-primary opacity-50 cursor-not-allowed text-black"
                : "bg-primary hover:bg-amber-500 text-black"
              }`}
          >
            {cleaDarLoading ? (
              <span>Saving...</span>
            ) : (
              <>
                <FaSave className="inline mr-2" /> {copyType ? "Save & Copy" : "Save"}
              </>
            )}
          </button>
          {/*       <button */}
          {/*         onClick={clearDay} */}
          {/*         disabled={cleaDarLoading} // ✅ disable while loading */}
          {/*         className={`glass-morphism flex-1 py-3 rounded-xl border border-red-400 transition-all */}
          {/* ${cleaDarLoading */}
          {/*             ? "opacity-50 cursor-not-allowed" */}
          {/*             : "text-red-400 hover:bg-red-500 hover:bg-opacity-20" */}
          {/*           }`} */}
          {/*       > */}
          {/*         {cleaDarLoading ? ( */}
          {/*           <span>Clearing...</span> // ✅ feedback while disabled */}
          {/*         ) : ( */}
          {/*           <> */}
          {/*             <FaTrash className="inline mr-2" /> Clear Day */}
          {/*           </> */}
          {/*         )} */}
          {/*       </button> */}
        </div>
      </div>
    </div>
  );
}
