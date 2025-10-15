import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "/noira.png";
import {
  Book,
  BookOpen,
  Calendar,
  Home,
  MessageSquare,
  User,
} from "lucide-react";
import useUserStore from "../../store/UserStore.jsx"; // adjust path if needed
import ConfirmLogoutModal from "../adminDashboard/ConfirmLogOutModal.jsx";

const TherapistSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Access Zustand user store
  const { user, clearUser } = useUserStore();

  const handleLogOut = () => {
    localStorage.clear();
    clearUser(); // clear from Zustand as well
    navigate("/");
  };
  const [isConfirmLogOutModalOpen, setIsConfirmLogOutModalOpen] = useState(false);


  const menuItems = [
    {
      name: "Dashboard",
      icon: <Home className="w-5 h-5" />,
      path: "/therapist/therapistdashboard",
    },
    {
      name: "Schedule",
      icon: <Calendar className="w-5 h-5" />,
      path: "/therapist/therapistschedule",
    },
    {
      name: "Bookings",
      icon: <BookOpen className="w-5 h-5" />,
      path: "/therapist/therapistbookingspage",
    },
    {
      name: "Payout Reports",
      icon: <BookOpen className="w-5 h-5" />,
      path: "/therapist/therapistpayout",
    },
    // {
    //   name: "Feedback",
    //   icon: <MessageSquare className="w-5 h-5" />,
    //   path: "/therapist/feedback",
    // },
    {
      name: "Profile",
      icon: <User className="w-5 h-5" />,
      path: `/therapist/therapistprofiletherapist`,
    },
    // {
    //   name: "Resources",
    //   icon: <Book className="w-5 h-5" />,
    //   path: `/therapist/therapistresources`,
    // },
  ];

  const fullName = user?.name
    ? `${user.name.first} ${user.name.last}`
    : "Therapist";

  const avatarUrl = user?.avatar_url;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full w-64 bg-[#111111] text-white flex-col justify-between border-r border-gray-800">
        {/* Logo */}
        <div>
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
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-700">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center text-sm">
                {user?.name?.first?.[0]?.toUpperCase() || "T"}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex flex-col text-white">
            <span className="text-sm font-semibold capitalize truncate">
              {fullName}
            </span>
            <button
              onClick={() => setIsConfirmLogOutModalOpen(true)}
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

        {/* Logout Button with Avatar */}
        <button
          onClick={() => setIsConfirmLogOutModalOpen(true)}
          className="flex flex-col items-center text-red-500 hover:text-red-400 transition"
        >
          {/* Avatar */}
          <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-600 ">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center text-sm text-white">
                {user?.name?.first?.[0]?.toUpperCase() || "T"}
              </div>
            )}
          </div>
          {/* Full Name */}
          {/* <span className="text-[10px] text-white">{fullName}</span> */}
          {/* Logout Text */}
          <span className="text-[10px] mt-1">Logout</span>
        </button>

      </div>
      <ConfirmLogoutModal isOpen={isConfirmLogOutModalOpen} onConfirm={handleLogOut} onClose={() => setIsConfirmLogOutModalOpen(false)} />


    </>
  );
};

export default TherapistSidebar;
