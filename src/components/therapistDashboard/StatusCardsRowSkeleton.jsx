
import React, { useEffect, useState } from "react";
import axios from "axios";

import sessionIcon from "../../assets/icons/sessions.svg";
import clockIcon from "../../assets/icons/clock.svg";
import chartIcon from "../../assets/icons/chart.svg";
import starIcon from "../../assets/icons/star.svg";

import StatusCard from "./StatusCard.jsx";

const StatusCardsRowSkeleton = () => {
  return (
    <div className="bg-[#111] border border-white/10 w-full min-h-[120px] p-6 rounded-2xl flex justify-between items-center shadow-md overflow-hidden relative">
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

      {/* Left: Title + Value Skeleton */}
      <div className="space-y-3">
        {/* Title skeleton */}
        <div className="h-4 bg-gray-700/50 rounded-md w-24"></div>
        {/* Value skeleton */}
        <div className="h-7 bg-gray-600/60 rounded-md w-16"></div>
      </div>

      {/* Right: Icon Skeleton */}
      <div className="p-4 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
        <div className="w-8 h-8 bg-gray-700/50 rounded"></div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

const StatusCardsRow = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const therapistId = localStorage.getItem("therapistId");
  const apiUrl = import.meta.env.VITE_API_URL;
  const therapistjwt = localStorage.getItem('therapistjwt');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`${apiUrl}/therapist/dashboard/${therapistId}`, {
          headers: {
            Authorization: `Bearer ${therapistjwt}`,
          },
        });
        console.log("This is the response for status card: ", res.data);
        setDashboardData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    if (therapistId) {
      fetchDashboardData();
    }
  }, [therapistId]);

  if (!dashboardData) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 gap-6 w-full">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 gap-6 w-full">
      <StatusCard
        title="Today's Sessions"
        value={dashboardData.todaysSessions ?? 0}
        color="text-yellow-400"
        icon={sessionIcon}
      />
      <StatusCard
        title="Pending Requests"
        value={dashboardData.pendingRequests ?? 0}
        color="text-yellow-500"
        icon={clockIcon}
      />
      <StatusCard
        title="This Week"
        value={dashboardData.weekSessions ?? 0}
        color="text-green-400"
        icon={chartIcon}
      />
      <StatusCard
        title="Rating"
        value={dashboardData.averageRating?.toFixed(1) ?? "0.0"}
        color="text-yellow-300"
        icon={starIcon}
      />
    </div>
  );
};

export default StatusCardsRowSkeleton;
