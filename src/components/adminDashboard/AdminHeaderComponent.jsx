
import React from "react";
import { FaBell } from "react-icons/fa";

export default function AdminHeaderComponent() {
  const adminName = localStorage.getItem("firstname");
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-800 bg-[#111] px-6 py-5">
      {/* Left Section */}
      <div className="min-w-0">
        <h1 className="text-xl font-semibold text-primary sm:text-2xl">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-400">Manage your wellness platform</p>
      </div>

      {/* Right Section */}
      <div className="flex min-w-0 items-start justify-end gap-2 text-right sm:max-w-xs">
        <FaBell className="mt-1 flex-shrink-0 text-base text-primary sm:text-lg" />
        <div className="min-w-0 text-sm leading-5 sm:leading-6">
          <span className="block text-gray-300">Welcome back,</span>
          <span className="block whitespace-nowrap font-medium text-primary">
            {adminName || "Noira"} Admin
          </span>
        </div>
      </div>
    </div>
  );
}
