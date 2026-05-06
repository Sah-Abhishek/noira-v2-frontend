import React from 'react';
import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaStar,
  FaSignOutAlt,
  FaUserFriends,
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext'; // Ensure correct path

const Sidebar = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`h-screen w-64 flex flex-col justify-between p-4 
      ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      
      {/* Logo */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-yellow-400 rounded-full p-2">
            <img src="/logo.png" alt="Logo" className="h-10" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-yellow-400">NOIRA</h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Therapist Portal
            </p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-2">
          <SidebarItem icon={<FaUserFriends />} label="Therapists" active={true} isDarkMode={isDarkMode} />
          <SidebarItem icon={<FaCalendarAlt />} label="Schedule" isDarkMode={isDarkMode} />
          <SidebarItem icon={<FaClock />} label="Bookings" isDarkMode={isDarkMode} />
          <SidebarItem icon={<FaStar />} label="Feedback" isDarkMode={isDarkMode} />
          <SidebarItem icon={<FaUser />} label="Profile" isDarkMode={isDarkMode} />
        </nav>
      </div>

      {/* User profile and logout */}
      <div className={`${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-gray-100'} rounded-lg p-4`}>
        <div className="flex items-center gap-3 mb-3">
          <img
            src="/user.jpg"
            alt="User"
            className="w-12 h-12 rounded-full border-2 border-yellow-400"
          />
          <div>
            <h3 className="text-sm font-semibold">Sarah Johnson</h3>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Massage Therapist
            </p>
          </div>
        </div>
        <button className="text-red-500 text-sm flex items-center gap-2 hover:text-red-600">
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, isDarkMode }) => {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer 
        ${active
          ? isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gray-300'
          : isDarkMode ? 'hover:bg-[#1a1a1a]' : 'hover:bg-gray-200'
        }`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default Sidebar;
