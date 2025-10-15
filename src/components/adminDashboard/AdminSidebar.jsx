// src/components/AdminSidebar.jsx
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "/noira.png";
import {
  Home,
  Users,
  FileText,
  BookOpen,
  Megaphone,
  Settings,
  UserStar,
  UserPen,
  MessageSquareHeart,
} from "lucide-react";
import ConfirmLogoutModal from "./ConfirmLogOutModal";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const firstname = localStorage.getItem("firstname");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <Home className="w-5 h-5" />, path: "/admin/admindashboard" },
    { name: "User Management", icon: <Users className="w-5 h-5" />, path: "/admin/usermanagement" },
    { name: "Therapist Management", icon: <UserStar className="w-5 h-5" />, path: "/admin/therapistmanagement" },
    // { name: "Content Manager", icon: <FileText className="w-5 h-5" />, path: "/admin/content" },
    { name: "Bookings", icon: <BookOpen className="w-5 h-5" />, path: "/admin/bookingsmanagement" },
    // { name: "Marketing", icon: <Megaphone className="w-5 h-5" />, path: "/admin/marketing" },
    { name: "Service Management", icon: <Megaphone className="w-5 h-5" />, path: "/admin/servicemanagement" },
    { name: "Settlement Reports", icon: <Megaphone className="w-5 h-5" />, path: "/admin/settlementreports" },
    { name: "Reviews", icon: <MessageSquareHeart className="w-5 h-5" />, path: "/admin/reviewsmanagement" },
    { name: "Profile", icon: <UserPen className="w-5 h-5" />, path: "/admin/adminprofile" },

    // { name: "Settings", icon: <Settings className="w-5 h-5" />, path: "/admin/settings" },
  ];

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.clear(); // clear all saved data
      navigate("/adminlogin"); // redirect to login
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full w-64 bg-[#111111] text-white flex-col justify-between border-r border-gray-800">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-6">
            <Link to="/">
              <img src={logo} alt="Noira Logo" className="w-auto h-8" />
            </Link>
          </div>

          {/* Menu */}
          <nav className="flex flex-col mt-4">
            {menuItems.map((item, idx) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition
                    ${isActive
                      ? "bg-[#1a1a1a] text-white"
                      : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
                    }`}
                >
                  {item.icon}
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile Section */}
        <div className="px-6 py-4 flex items-center gap-4 border-t border-gray-800">
          {/* Profile Icon */}
          <div className="flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </div>

          {/* User Info */}
          <div className="flex flex-col text-white">
            <span className="text-sm font-semibold capitalize">
              {firstname
                ? firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase()
                : "Admin"}
            </span>
            <span className="text-xs text-gray-400">Administrator</span>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="text-xs text-red-500 mt-1 hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#111111] border-t border-gray-800 flex justify-around py-2 z-50">
        {menuItems.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center transition ${isActive ? "text-white" : "text-gray-400 hover:text-white"
                }`}
            >
              {item.icon}
              <span className="text-[10px] mt-1">{item.name}</span>
            </button>
          );
        })}
      </div>
      <ConfirmLogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          localStorage.clear();
          navigate("/adminlogin");
        }}
      />
    </>
  );
};

export default AdminSidebar;
