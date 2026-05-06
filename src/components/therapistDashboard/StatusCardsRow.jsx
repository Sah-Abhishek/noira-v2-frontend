import React, { useEffect, useState } from "react";
import axios from "axios";

import sessionIcon from "../../assets/icons/sessions.svg";
import clockIcon from "../../assets/icons/clock.svg";
import chartIcon from "../../assets/icons/chart.svg";
import pound from "../../assets/icons/pound.png";

import StatusCard from "./StatusCard.jsx";
import StatusCardsRowSkeleton from "./StatusCardsRowSkeleton.jsx";

const StatusCardsRow = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [filter, setFilter] = useState("today"); // default filter
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(false);
  const therapistId = localStorage.getItem("therapistId");
  const apiUrl = import.meta.env.VITE_API_URL;
  const therapistjwt = localStorage.getItem("therapistjwt");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        let body = { filter };

        if (filter === "custom" && customRange.start && customRange.end) {
          body.startDate = customRange.start;
          body.endDate = customRange.end;
        }

        const res = await axios.post(
          `${apiUrl}/therapist/dashboard/${therapistId}`,
          body,
          {
            headers: {
              Authorization: `Bearer ${therapistjwt}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Dashboard API Response:", res.data);
        setDashboardData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (therapistId) {
      fetchDashboardData();
    }
  }, [therapistId, filter, customRange]);

  if (!dashboardData || loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 gap-6 w-full">
        <StatusCardsRowSkeleton />
        <StatusCardsRowSkeleton />
        <StatusCardsRowSkeleton />
        <StatusCardsRowSkeleton />
      </div>
    );
  }

  // Pick sessions object based on filter
  const getSessionsData = () => {
    if (filter === "today") return dashboardData.todaysSessions || {};
    if (filter === "week") return dashboardData.weekSessions || {};
    if (filter === "month") return dashboardData.monthSessions || {};
    return {};
  };

  const { confirmed = 0, completed = 0 } = getSessionsData();

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {["today", "week", "month", "custom"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm
              ${filter === type
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
          >
            {type === "today" && "Today"}
            {type === "week" && "Week"}
            {type === "month" && "Month"}
            {type === "custom" && "Custom"}
          </button>
        ))}

        {filter === "custom" && (
          <div className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg shadow-inner dark:bg-gray-800 dark:shadow-none">
            <input
              type="date"
              value={customRange.start}
              onChange={(e) =>
                setCustomRange((prev) => ({ ...prev, start: e.target.value }))
              }
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none 
                   dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            />
            <span className="text-gray-500 dark:text-gray-400">to</span>
            <input
              type="date"
              value={customRange.end}
              onChange={(e) =>
                setCustomRange((prev) => ({ ...prev, end: e.target.value }))
              }
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none 
                   dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 gap-6 w-full">
        <StatusCard
          title="Average Rating"
          value={dashboardData.averageRating ?? 0}
          color="text-yellow-400"
          icon={sessionIcon}
        />
        <StatusCard
          title="Pending Sessions"
          value={confirmed}
          color="text-green-400"
          icon={chartIcon}
        />
        <StatusCard
          title="Completed Sessions"
          value={completed}
          color="text-blue-400"
          icon={clockIcon}
        />
        <StatusCard
          title="Earnings"
          value={`£${dashboardData.totalRevenue?.toFixed(1) ?? "0.0"}`}
          color="text-yellow-300"
          icon={pound}
        />
      </div>
    </div>
  );
};

export default StatusCardsRow;
