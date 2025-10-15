import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import axios from "axios";

const TherapistAvailabilityModal = ({ therapistId, isOpen, onClose }) => {
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isOpen && therapistId) {
      fetchTherapistAvailability();
    }
  }, [isOpen, therapistId]);

  const fetchTherapistAvailability = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(
        `${apiUrl}/admin/therapist/schedule/${therapistId}`
      );

      if (data.success) {
        setTherapist(data.therapist);
        if (data.therapist.availabilities?.length > 0) {
          setSelectedDate(data.therapist.availabilities[0].date);
          setCurrentMonth(new Date(data.therapist.availabilities[0].date));
        }
      } else {
        setError("Failed to load therapist availability");
      }
    } catch (err) {
      console.error("Error fetching therapist availability:", err);
      setError(
        err.response?.data?.message || "Failed to fetch therapist availability"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getSelectedDayBlocks = () => {
    if (!therapist || !selectedDate) return [];
    const day = therapist.availabilities.find((a) => a.date === selectedDate);
    return day?.blocks || [];
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getAvailabilityForDate = (date) => {
    if (!therapist || !date) return null;
    // Create date string in local timezone to avoid offset issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return therapist.availabilities?.find(
      (a) => a.date.split("T")[0] === dateStr
    );
  };

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  if (!isOpen) return null;

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#111] border border-primary/30 rounded-xl max-w-7xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-primary/20">
        {/* Header */}
        <div className="bg-[#0d0d0d] border-b border-primary/20 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {therapist && (
              <>
                <img
                  src={therapist.avatar_url}
                  alt={therapist.name.first}
                  className="w-16 h-16 rounded-full border-2 border-primary/50"
                />
                <div>
                  <h2 className="text-2xl font-bold text-primary">
                    {therapist.title}
                  </h2>
                  <p className="text-gray-400">
                    {therapist.name.first} {therapist.name.last}
                  </p>
                </div>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-primary transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-primary">Loading availability...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center text-red-500">
                <p className="text-xl mb-4">{error}</p>
                <button
                  onClick={fetchTherapistAvailability}
                  className="bg-primary text-black px-6 py-2 rounded-lg hover:bg-primary/80 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : therapist ? (
            <div className="p-6">
              {/* Contact Info */}
              <div className="bg-[#0d0d0d] rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-sm">{therapist.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-sm">{therapist.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-2">
                  <div className="bg-[#0d0d0d] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        {monthName}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={previousMonth}
                          className="p-2 bg-[#111] border border-primary/20 rounded hover:border-primary/50 transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 text-primary" />
                        </button>
                        <button
                          onClick={nextMonth}
                          className="p-2 bg-[#111] border border-primary/20 rounded hover:border-primary/50 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 text-primary" />
                        </button>
                      </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day) => (
                          <div
                            key={day}
                            className="text-center text-xs font-semibold text-primary py-2"
                          >
                            {day}
                          </div>
                        )
                      )}
                      {days.map((day, index) => {
                        if (!day)
                          return (
                            <div key={`empty-${index}`} className="aspect-square" />
                          );

                        const availability = getAvailabilityForDate(day);
                        const hasAvailableSlots = availability?.blocks.some(
                          (b) => b.isAvailable
                        );
                        const isSelected =
                          selectedDate &&
                          selectedDate.split("T")[0] ===
                          `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
                        const isToday =
                          new Date().toDateString() === day.toDateString();

                        return (
                          <button
                            key={index}
                            onClick={() =>
                              availability && setSelectedDate(availability.date)
                            }
                            disabled={!availability}
                            className={`aspect-square p-2 rounded-lg border transition-all relative ${isSelected
                              ? "bg-primary text-black border-primary font-bold"
                              : availability
                                ? hasAvailableSlots
                                  ? "bg-[#111] border-primary/30 text-gray-300 hover:border-primary/50 hover:bg-primary/5"
                                  : "bg-red-950/20 border-red-600/20 text-red-400"
                                : "bg-[#0d0d0d] border-primary/10 text-gray-600 cursor-not-allowed"
                              }`}
                          >
                            <div className="text-sm">{day.getDate()}</div>
                            {isToday && (
                              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                            )}
                            {availability && (
                              <div className="absolute top-1 right-1">
                                {hasAvailableSlots ? (
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                ) : (
                                  <XCircle className="w-3 h-3 text-red-500" />
                                )}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border border-primary/30 bg-[#111] rounded" />
                        <span>Has Availability</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border border-red-600/20 bg-red-950/20 rounded" />
                        <span>Fully Booked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border border-primary/10 bg-[#0d0d0d] rounded" />
                        <span>No Schedule</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Slots */}
                <div className="lg:col-span-1">
                  <div className="bg-[#0d0d0d] rounded-lg p-4 sticky top-6">
                    <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {selectedDate
                        ? formatDate(selectedDate)
                        : "Select a date"}
                    </h4>
                    {selectedDate ? (
                      <div className="space-y-2 max-h-[500px] overflow-y-auto">
                        {getSelectedDayBlocks().map((block, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg border ${block.isAvailable
                              ? "bg-[#111] border-primary/30"
                              : "bg-red-950/20 border-red-600/30 opacity-60"
                              }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span
                                className={`text-sm font-semibold ${block.isAvailable
                                  ? "text-primary"
                                  : "text-red-400"
                                  }`}
                              >
                                {block.startTime} - {block.endTime}
                              </span>
                              {block.isAvailable ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-400" />
                              )}
                            </div>
                            <span
                              className={`text-xs ${block.isAvailable
                                ? "text-green-500"
                                : "text-red-400"
                                }`}
                            >
                              {block.isAvailable ? "Available" : "Booked"}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-400 text-sm">
                        Click on a date in the calendar to view time slots
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 bg-primary/10 border border-primary/30 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {therapist.availabilities?.length || 0}
                    </p>
                    <p className="text-sm text-gray-400">Total Days</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-500">
                      {therapist.availabilities?.reduce(
                        (acc, day) =>
                          acc +
                          day.blocks.filter((b) => b.isAvailable).length,
                        0
                      ) || 0}
                    </p>
                    <p className="text-sm text-gray-400">Available Slots</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-400">
                      {therapist.availabilities?.reduce(
                        (acc, day) =>
                          acc + day.blocks.filter((b) => !b.isAvailable).length,
                        0
                      ) || 0}
                    </p>
                    <p className="text-sm text-gray-400">Booked Slots</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TherapistAvailabilityModal;
