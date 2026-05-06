
import React from "react";

export default function UserDashboard() {
  const userName = localStorage.getItem("userName") || "Guest";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-primary drop-shadow-md">
          Hello, {userName} 👋
        </h1>
        <p className="text-gray-400 text-lg">
          Welcome back to your dashboard
        </p>
      </div>
    </div>
  );
}
