// src/components/AdminSidebar.jsx
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "/noira-london-vip.png";
import {
  Home,
  Users,
  FileText,
  BookOpen,
  Megaphone,
  UserStar,
  UserPen,
  MessageSquareHeart,
  Ticket,
  Image,
  MapPin,
  BarChart3,
  Handshake,
  Building2,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import ConfirmLogoutModal from "./ConfirmLogOutModal";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const firstname = localStorage.getItem("firstname");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <Home className="w-5 h-5" />, path: "/admin/admindashboard" },
    { name: "User Management", icon: <Users className="w-5 h-5" />, path: "/admin/usermanagement" },
    { name: "Therapist Management", icon: <UserStar className="w-5 h-5" />, path: "/admin/therapistmanagement" },
    { name: "Content Management", icon: <FileText className="w-5 h-5" />, path: "/admin/contentmanagement" },
    { name: "Bookings", icon: <BookOpen className="w-5 h-5" />, path: "/admin/bookingsmanagement" },
    // { name: "Marketing", icon: <Megaphone className="w-5 h-5" />, path: "/admin/marketing" },
    { name: "Service Management", icon: <Megaphone className="w-5 h-5" />, path: "/admin/servicemanagement" },
    { name: "Settlement Reports", icon: <Megaphone className="w-5 h-5" />, path: "/admin/settlementreports" },
    { name: "Reviews", icon: <MessageSquareHeart className="w-5 h-5" />, path: "/admin/reviewsmanagement" },
    { name: "Coupons", icon: <Ticket className="w-5 h-5" />, path: "/admin/couponmanagement" },
    { name: "Coupon Analytics", icon: <BarChart3 className="w-5 h-5" />, path: "/admin/couponanalytics" },
    { name: "Banners", icon: <Image className="w-5 h-5" />, path: "/admin/bannermanagement" },
    { name: "Postcode Analytics", icon: <MapPin className="w-5 h-5" />, path: "/admin/postcodeanalytics" },
    { name: "Partnerships", icon: <Handshake className="w-5 h-5" />, path: "/admin/partnershipenquiries" },
    { name: "Airbnb Hosts", icon: <Building2 className="w-5 h-5" />, path: "/admin/airbnbhostapplications" },
    { name: "Profile", icon: <UserPen className="w-5 h-5" />, path: "/admin/adminprofile" },

    // { name: "Settings", icon: <Settings className="w-5 h-5" />, path: "/admin/settings" },
  ];

  const activeItem = menuItems.find((item) => location.pathname === item.path) || menuItems[0];
  const mobilePrimaryPaths = [
    "/admin/admindashboard",
    "/admin/bookingsmanagement",
    "/admin/bannermanagement",
    "/admin/adminprofile",
  ];
  const mobilePrimaryItems = menuItems.filter((item) => mobilePrimaryPaths.includes(item.path));

  const handleMobileNavigate = (path) => {
    setShowMobileMenu(false);
    navigate(path);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full w-64 bg-[#111111] text-white flex-col border-r border-gray-800">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain [scrollbar-color:#4b5563_#111111] [scrollbar-width:thin]">
          {/* Logo */}
          <div className="flex flex-shrink-0 items-center gap-2 px-6 py-6">
            <Link to="/">
              <img src={logo} alt="Noira Logo" className="w-auto h-8" />
            </Link>
          </div>

          {/* Menu */}
          <nav className="mt-4 flex flex-col pb-4">
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

          {/* Profile Section */}
          <div className="border-t border-gray-800 px-4 py-4">
            {/* Profile Icon */}
            <div className="flex items-center gap-3 rounded-lg bg-[#171717] px-3 py-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gray-700 bg-[#202020] text-sm font-semibold text-primary">
                {(firstname || "Admin").charAt(0).toUpperCase()}
              </div>

              {/* User Info */}
              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold capitalize text-white">
                  {firstname
                    ? firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase()
                    : "Admin"}
                </span>
                <span className="block truncate text-xs text-gray-400">Administrator</span>
              </div>

              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-[#2a2a2a] hover:text-red-400"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setShowMobileMenu(false)}>
          <div
            className="absolute bottom-16 left-0 right-0 max-h-[70vh] overflow-hidden rounded-t-2xl border-t border-gray-800 bg-[#111111] text-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
              <span className="text-sm font-semibold">Admin Features</span>
              <button
                type="button"
                onClick={() => setShowMobileMenu(false)}
                className="rounded-full p-2 text-gray-400 transition hover:bg-[#1a1a1a] hover:text-white"
                aria-label="Close admin menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav
              id="admin-mobile-menu"
              className="max-h-[calc(70vh-56px)] overflow-y-auto overscroll-contain py-2 [scrollbar-color:#4b5563_#111111] [scrollbar-width:thin]"
            >
              {menuItems.map((item, idx) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleMobileNavigate(item.path)}
                    className={`flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-medium transition ${
                      isActive
                        ? "bg-[#1a1a1a] text-white"
                        : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setShowMobileMenu(false);
                  setShowLogoutModal(true);
                }}
                className="mt-2 flex w-full items-center gap-3 border-t border-gray-800 px-5 py-4 text-left text-sm font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-5 border-t border-gray-800 bg-[#111111] text-white lg:hidden">
        {mobilePrimaryItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              type="button"
              onClick={() => handleMobileNavigate(item.path)}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-semibold transition ${
                isActive ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="max-w-full truncate">{item.name.replace(" Management", "")}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setShowMobileMenu((isOpen) => !isOpen)}
          className={`flex min-w-0 flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-semibold transition ${
            showMobileMenu || !mobilePrimaryPaths.includes(activeItem.path)
              ? "text-primary"
              : "text-gray-400 hover:text-white"
          }`}
          aria-expanded={showMobileMenu}
          aria-controls="admin-mobile-menu"
        >
          <Menu className="h-5 w-5" />
          <span>Menu</span>
        </button>
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
