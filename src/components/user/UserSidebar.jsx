import React, { useState, Fragment } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "/noira.png";
import { Home, User, BookOpen, Settings, Menu, X } from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import useUserStore from "../../store/UserStore";

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserStore();
  const firstname = user?.name?.first;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <Home className="w-5 h-5" />, path: "/" },
    { name: "Book Sessions", icon: <Home className="w-5 h-5" />, path: "/allservicespage" },
    { name: "Browse Therapists", icon: <Home className="w-5 h-5" />, path: "/browsetherapists" },
    { name: "My Bookings", icon: <BookOpen className="w-5 h-5" />, path: "/user/mybookings" },
  ];

  const extraItems = [
    { name: "Profile", icon: <User className="w-5 h-5" />, path: "/user/userprofile" },
    // { name: "Settings", icon: <Settings className="w-5 h-5" />, path: "/user/settings" },
  ];

  const handleLogOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/userlogin");
  };

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
            {menuItems.concat(extraItems).map((item, idx) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={idx}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition ${isActive
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

        {/* Profile + Logout */}
        <div className="px-6 py-4 flex items-center gap-4 border-t border-gray-800 ">
          <div className="flex-shrink-0">
            <User className="w-8 h-8 text-gray-300" />
          </div>
          <div className="flex flex-col text-white">
            <span className="text-sm font-semibold capitalize">
              {firstname ? firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase() : "User"}
            </span>
            <button onClick={handleLogOut} className="text-xs text-red-500 mt-1 hover:underline">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#111111] border-t border-gray-800 flex justify-around items-center py-2 z-50">
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

        {/* Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center text-gray-400 hover:text-white"
        >
          <Menu className="w-6 h-6" />
          <span className="text-[10px] mt-1">More</span>
        </button>
      </div>

      {/* Mobile Slide-Up Menu */}
      <Transition show={isMobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsMobileMenuOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="ease-in duration-150"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 right-0 bg-[#111111] border-t border-gray-800 rounded-t-2xl p-6">
              {/* Close Button */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-semibold">More Options</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Extra Menu */}
              <nav className="flex flex-col gap-3">
                {extraItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
                  >
                    {item.icon}
                    {item.name}
                  </button>
                ))}

                <button
                  onClick={handleLogOut}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-red-500 hover:bg-[#1a1a1a]"
                >
                  <X className="w-5 h-5" />
                  Logout
                </button>
              </nav>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
};

export default UserSidebar;
