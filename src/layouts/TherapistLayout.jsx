// src/layouts/TherapistLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import TherapistSidebar from "../components/therapistDashboard/TherapistSidebar.jsx";

const TherapistLayout = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar (desktop only) */}
      <TherapistSidebar variant="desktop" className="hidden md:flex w-64 h-full" />

      {/* Main Content */}
      <div className="flex-1 bg-[#111111] overflow-y-auto pb-14 md:pb-0">
        <Outlet />
      </div>

      {/* Mobile Bottom Navbar */}
      <div className="md:hidden">
        <TherapistSidebar variant="mobile" />
      </div>
    </div>
  );
};

export default TherapistLayout;
